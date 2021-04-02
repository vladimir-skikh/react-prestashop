<?php

if (!defined('_PS_VERSION_'))
    exit;


class PwOrderHistories extends Module
{
    public function __construct()
    {
        $this->name = strtolower(get_class());
        $this->tab = 'other';
        $this->version = 1.0;
        $this->author = 'PrestaWeb.ru';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->controllers = array('AdminOrderHistories');
        $this->displayName = $this->l("История заказов");
        $this->description = $this->l("Отображает историю изменения статусов заказов");
        
        $this->ps_versions_compliancy = array('min' => '1.6.0.0', 'max' => _PS_VERSION_);
    }

    public function install()
    {

        if ( !parent::install() 
            || !$this->registerHook('displayBackOfficeHeader')
            || !$this->installModuleTab()
        ) return false;

        return true;
    }

    public function uninstall()
    {
        if (!parent::uninstall() || !$this->uninstallModuleTab()) {
            return false;
        }
        return true;
    }

    private function installModuleTab() 
    {
        $response = true;
        $parentTabID = Tab::getIdFromClassName('AdminOrders');
        
        $langs = Language::getLanguages();

        $valTab = new Tab();
        $valTab->class_name = 'AdminOrderHistories';
        $valTab->module = $this->name;
        $valTab->id_parent = $parentTabID;

        foreach ($langs as $l)
            $valTab->name[$l['id_lang']] = $this->l('История заказов');

        if (version_compare(_PS_VERSION_, '1.7.0', '>=') === true) {
            $response &= $valTab->save();
        }
        else {
            $response &= $valTab->add();
        }

        return $response;
    }

    private function uninstallModuleTab() {

        $response = true;
        
        $idTab = Tab::getIdFromClassName('AdminOrderHistories');

        if ($idTab != 0) {
            $tab = new Tab($idTab);
            $response &= $tab->delete();
        }

        return $response;
    }
}


