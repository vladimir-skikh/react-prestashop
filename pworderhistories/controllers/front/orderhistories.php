<?php 

class PwOrderHistoriesOrderhistoriesModuleFrontController extends ModuleFrontController
{

    public $checkedFilterCulomns = array();

    public function __construct()
    {
        parent::__construct();
    }

    public function initContent()
    {
        $post_vars = json_decode(file_get_contents('php://input'), true);
        $method = Tools::getValue('method') ? Tools::getValue('method') : ($post_vars['method'] ? $post_vars['method'] : false);

        if (!$method) {
            die(json_encode(array(
                'error' => 'There is no such method in API'
            )));
        }

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
                    'hasError' => true,
                    'result' => array('resultCode' => 1),
                    'error_msg' => 'Ошибка на при вызове метода '.$call_method
                )));
            }
        }

        die(json_encode(array(
            'request' => $call_method,
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
                if (
                    mb_strpos($column_name, 'equal') !== false ||
                    mb_strpos($column_name, 'range') !== false ||
                    mb_strpos($column_name, 'wherein') !== false
                ) {
                    $column_name_correct = explode('||', $column_name);
                    $table_column = explode('|', $column_name_correct[0]);

                    if (!in_array($table_column[1], $this->checkedFilterCulomns)) {
                        $where .= $this->getFilterParamsRange($column_name, $filter).' AND ';
                        $this->checkedFilterCulomns[] = $table_column[1];
                    }
                }
                else $where .= $this->getFilterParams($column_name, $value).' AND ';
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

        $sql_count = '';
        if ($_GET['filterModal']) {
            $sql_count = $sql;
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

        if ($sql_count === '') {
            $sql_count = 'SELECT * FROM `'._DB_PREFIX_.'order_history`';
        }
        
        $count = Db::getInstance()->executeS($sql_count);

        return array(
            'order_histories' => $order_histories,
            'count' => count($count),
        );
    }

    public function getFilterParams($column_name, $value) 
    {
        $where = '(';
        $table_column = explode('|', $column_name);

        $table_name = $table_column[0] == 'main' ? 'oh.' : ($table_column[0] == 'nothing' ? '' : $table_column[0].'.');
        $tc_expression = $table_name.$table_column[1];
        
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
            if ($tc_expression === 'employee') { // Не знаю как быстро сделать лучше поиск по имени работника
                $where .= 'CONCAT(CONCAT(e.firstname, " "), e.lastname) LIKE "%'.$like_value.'%")';
            }
            else
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

    public function getFilterParamsRange($column_name, $filter) 
    {
        $where = '(';
        $condition_wherein = false;
        $condition_equal = false;
        $condition_range_from = false;
        $condition_range_to = false;

        $column_name_correct = explode('||', $column_name);
        $table_column = explode('|', $column_name_correct[0]);
        $table_name = $table_column[0] == 'main' ? 'oh.' : ($table_column[0] == 'nothing' ? '' : $table_column[0].'.');
        $tc_expression = $table_name.$table_column[1];

        if (array_key_exists($column_name_correct[0].'||wherein', $filter)) {
            $condition_wherein = true;
        }
        if (array_key_exists($column_name_correct[0].'||equal', $filter)) {
            $condition_equal = true;
        }
        if (array_key_exists($column_name_correct[0].'||range-from', $filter)) {
            $condition_range_from = true;
        }
        if (array_key_exists($column_name_correct[0].'||range-to', $filter)) {
            $condition_range_to = true;
        }

        if ($condition_wherein) {
            preg_match('/\[(.*?)\]/', $_GET['filter'][$column_name_correct[0].'||wherein'], $matches);
            $wherein_values = explode(',', $matches[1]);
            $where .= $tc_expression.' IN (';
            foreach ($wherein_values as $wherein_value) {
                $where .=  $wherein_value.',';
            }

            $where = mb_substr($where, 0, -1).') OR ';
        }
        if ($condition_equal) {
            preg_match('/\[(.*?)\]/', $_GET['filter'][$column_name_correct[0].'||equal'], $matches);
            $value_equal = $matches[1];
            
            $where .= $tc_expression.' = "'.$value_equal.'" OR ';
        }

        if ($condition_range_from && $condition_range_to) {
            preg_match('/\[(.*?)\]/', $_GET['filter'][$column_name_correct[0].'||range-from'], $matches_more);
            $more_value = $matches_more[1];

            preg_match('/\[(.*?)\]/', $_GET['filter'][$column_name_correct[0].'||range-to'], $matches_less);
            $less_value = $matches_less[1];

            $where .= '('.$tc_expression.' >= '.(int)$more_value.' AND '.$tc_expression.' <= "'.(int)$less_value.'") OR ';
        }
        else if ($condition_range_from && !$condition_range_to) {
            preg_match('/\[(.*?)\]/', $_GET['filter'][$column_name_correct[0].'||range-to'], $matches);
            $more_value = $matches[1];
            $where .= $tc_expression.' >= '.(int)$more_value.' OR ';
        }
        else if ($condition_range_to && !$condition_range_from) {
            preg_match('/\[(.*?)\]/', $_GET['filter'][$column_name_correct[0].'||range-to'], $matches);
            $less_value = $matches[1];
            $where .= $tc_expression.' <= '.(int)$less_value.' OR ';
        }


        $where = mb_substr($where, 0, -3).')';
        return $where;
    }

    public function apiUpdateComment()
    {
        $post_vars = json_decode(file_get_contents('php://input'), true);

        $id_order_history = (int)$post_vars['id_order_history'];
        $commnet = $post_vars['comment'];

        $sql = 'UPDATE `'._DB_PREFIX_.'order_history` SET comment = "'.$commnet.'" WHERE id_order_history = "'.$id_order_history.'"';

        Db::getInstance()->execute($sql);
        $affected_rows = Db::getInstance()->Affected_Rows();
        $error_msg = '';
        if ($affected_rows === 0) {
            $error_msg = 'Some error with comment update';
        }

        $result = array(
            'error_msg' => $error_msg,
            'affected_rows' => $affected_rows
        );

        return $result;
    }
}