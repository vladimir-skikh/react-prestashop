<?php

class AdminOrderHistoriesController extends ModuleAdminController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function initContent()
	{
        $this->context->smarty->assign(array(
            'static_folder' => _PS_BASE_URL_SSL_.'/modules/pworderhistories/build/static/'
        ));

        Media::addJsDef(array(
            'buildURL' => _PS_BASE_URL_SSL_.'/modules/pworderhistories/build/',
        ));

        $this->content .= $this->context->smarty->fetch(_PS_MODULE_DIR_.'/pworderhistories/build/index.tpl');

        $this->context->smarty->assign(array(
            'content' => $this->content,
        ));
	}
}