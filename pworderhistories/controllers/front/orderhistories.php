<?php 

class PwOrderHistoriesOrderhistoriesModuleFrontController extends ModuleFrontController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function initContent()
    {
        $method = Tools::getValue('method');
        $call_method = 'api'.Tools::toCamelCase($method, 1);
        if (method_exists($this, $call_method))
        {
            try
            {
                $result = call_user_func(array($this, $call_method));
                die(json_encode($result));
            }
            catch(Exception $e)
            {
                die(json_encode(array(
                    'hasError' => 'Error',
                    'result' => array('resultCode' => 1)
                )));
            }
        }

        die(json_encode(array(
            'request' => Tools::getAllValues(),
        )));
    }

    public function apiGetOrderHistories()
    {

        $sql = 'SELECT';
        $display = 'full';
        $limit = 20;
        $filter = array();
        $sort = '';

        if (isset($_GET['limit'])) {
            $limit = $_GET['limit'];
        }
        if (isset($_GET['filter'])) {
            $filter = $_GET['filter'];
        }
        if (isset($_GET['display'])) {
            $display = $_GET['display'];
        }
        if (isset($_GET['sort'])) {
            $sort = $_GET['sort'];
        }

        $id_lang = $this->context->language->id;

        if ($display === 'full') {
            $sql .= ' oh.*, CONCAT(CONCAT(e.firstname, " "), e.lastname) as employee, osl.name as state_name';

        }
        else if (is_array($display)) {
            $columns = '';
            foreach ($display as $column_name) {
                $columns .= ' oh.'.$column_name.',';
            }
            $columns = mb_substr($columns, 0, -1);

            $sql .= $columns . 'CONCAT(e.firstname, e.lastname) as employee, osl.name as state_name';
        }

        $sql .= ' FROM `'._DB_PREFIX_.'order_history` oh
            LEFT JOIN `'._DB_PREFIX_.'employee` e ON e.id_employee = oh.id_employee
            LEFT JOIN `'._DB_PREFIX_.'order_state_lang` osl ON osl.id_order_state = oh.id_order_state';

        $where = ' WHERE 1 AND ';

        if (!empty($filter)) {
            foreach ($filter as $column_name => $value) {
                $where .= $this->getFilterParams($column_name, $value).' AND ';
            }
        }

        $sql .= $where;
        $sql .= ' osl.id_lang = "'.$id_lang.'"';

        if ($sort !== '') {
            preg_match('/\[(.*?)\]/', $sort, $matches_sort);
            $orderby_orderway = explode('-', $matches_sort[1]);

            $tc_orderby = explode('|', $orderby_orderway[0]);

            $table_name = $tc_orderby[0] === 'main' ? 'oh.' : ($tc_orderby[0]  === 'nothing' ? '' : $tc_orderby[0].'.');

            
            $sql_order = ' ORDER BY '.$table_name.$tc_orderby[1].' '.mb_strtoupper($orderby_orderway[1]).' ';
            $sql .= $sql_order;
        }
        
        $sql .= ' LIMIT '.$limit.' ';

        $order_histories = Db::getInstance()->executeS($sql);

        foreach ($order_histories as &$row) {
            $sql_old_state = '
                SELECT oh.id_order_state, osl.name as old_state_name
                FROM `'._DB_PREFIX_.'order_history` oh
                LEFT JOIN `'._DB_PREFIX_.'order_state_lang` osl ON osl.id_order_state = oh.id_order_state
                WHERE 1 AND oh.id_order = "'.$row['id_order'].'" AND oh.id_order_history < "'.$row['id_order_history'].'" AND osl.id_lang = "'.$id_lang.'"
                ORDER BY id_order_history DESC
            ';

            $old_state = Db::getInstance()->getRow($sql_old_state);
            $row['id_old_state'] = $old_state['id_order_state'];
            $row['old_state_name'] = $old_state['old_state_name'];
        }

        $sql_count = 'SELECT COUNT(*) FROM `'._DB_PREFIX_.'order_history`';
        $count = Db::getInstance()->getValue($sql_count);

        return array(
            'order_histories' => $order_histories,
            'count' => (int)$count,
        );
    }

    public function getFilterParams($column_name, $value) 
    {
        $where = '(';

        $table_column = explode('|', $column_name);
        $table_name = $table_column[0] == 'main' ? 'oh' : $table_column[0];
        $tc_expression = $table_name.'.'.$table_column[1];

        if (strpos($value, '|') !== false) {
            preg_match('/\[(.*?)\]/', $value, $matches);
            $or_values = explode('|', $matches[1]);

            foreach ($or_values as $or_value) {
                $where .= $tc_expression.' = "'.$or_value.'" OR ';
            }
            
            $where = mb_substr($where, 0, -3).') ';
        }
        else if (strpos($value, ',') !== false) {
            preg_match('/\[(.*?)\]/', $value, $matches);
            $interval_values = explode(',', $matches[1]);

            $where .= $tc_expression.' BETWEEN "'.$interval_values[0].'" AND "'.$interval_values[1].'")';
        }
        else if (substr_count($value, '%') === 2) {
            preg_match('/\[(.*?)\]/', $value, $matches);
            $like_value = $matches[1];
            
            $where .= $tc_expression.' LIKE "%'.$like_value.'%")';
        }
        else if (substr_count($value, '%') === 1 && strpos($value, '%') === 0) {
            preg_match('/\[(.*?)\]/', $value, $matches);
            $like_value = $matches[1];
            
            $where .= $tc_expression.' LIKE "%'.$like_value.'")';
        }
        else if (substr_count($value, '%') === 1 && strpos($value, '%') !== 0) {
            preg_match('/\[(.*?)\]/', $value, $matches);
            $like_value = $matches[1];
            
            $where .= $tc_expression.' LIKE "'.$like_value.'%")';
        }
        else if (strpos($value, '!') !== false) {
            preg_match('/\[(.*?)\]/', $value, $matches);
            $not_value = $matches[1];
            
            $where .= 'NOT '.$tc_expression.' = "'.$not_value.'")';
        }
        else {
            preg_match('/\[(.*?)\]/', $value, $matches);
            $where .= $tc_expression.' = "'.$matches[1].'")';
        }

        return $where;
    }
}