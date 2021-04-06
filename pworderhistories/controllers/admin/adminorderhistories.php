<?php

class AdminOrderHistoriesController extends ModuleAdminController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function initContent()
	{
        $this->content .= $this->context->smarty->fetch(_PS_MODULE_DIR_.'/pworderhistories/build/index.tpl');

        $this->context->smarty->assign(array(
            'content' => $this->content,
        ));
	}
}