(this["webpackJsonpreact-prestashop"]=this["webpackJsonpreact-prestashop"]||[]).push([[0],{10:function(e,t,r){e.exports={pagination:"Pagination_pagination__q_MPa",paginationList:"Pagination_paginationList__2WQyc",paginationListItem:"Pagination_paginationListItem__32lIT",paginationListItemCurrent:"Pagination_paginationListItemCurrent__CMMw5",hidden:"Pagination_hidden__1Yhht"}},22:function(e,t,r){e.exports={paginationListItemCurrent:"Preloader_paginationListItemCurrent__23JwV",preloader:"Preloader_preloader__25UOJ"}},31:function(e,t,r){},4:function(e,t,r){e.exports={orderHistoryRow:"OrderHistory_orderHistoryRow__3BJzk",cell:"OrderHistory_cell__1U2tn",lastCell:"OrderHistory_lastCell__3VCT0"}},41:function(e,t,r){},68:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r.n(a),i=r(17),o=r.n(i),s=(r(41),r(13)),c=r(14),l=r(16),d=r(15),u=r(11),p=r(32),h=r(2),_=r.n(h),b=r(7),m=r(36),j=r(3),f=r(33),O=r.n(f).a.create({withCredentials:!0,baseURL:"https://strategshop/module/pworderhistories/orderhistories"}),g={getOrdersHistories:function(){var e=Object(b.a)(_.a.mark((function e(){var t,r,a=arguments;return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.length>0&&void 0!==a[0]?a[0]:{},r={method:"getOrderHistories",limit:t.limit?t.limit:20,display:"full",sort:t.sort?t.sort:"[main|id_order_history-DESC]","filter[main|id_employee]":"![0]"},e.abrupt("return",O.get("",{params:r}).then((function(e){return e.data})));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),updateComment:function(){var e=Object(b.a)(_.a.mark((function e(t,r){var a;return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={method:"updateComment",id_order_history:t,commnet:r},e.abrupt("return",O.put("",a).then((function(e){return e.data})));case 2:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}()},v="react-prestashop/indexReducer/SET-INIT-APP",y="react-prestashop/indexReducer/SET-ORDERS-HISTORIES",x="react-prestashop/indexReducer/SET-TOTAL-ORDER-HISTORIES",C="react-prestashop/indexReducer/SET-TOTAL-PAGES",w="react-prestashop/indexReducer/ONCHANGE-CURRENT-PAGE",T="react-prestashop/indexReducer/SET-IS-FETCHING",S="react-prestashop/indexReducer/SET-SORT",R={initialized:!1,table_columns:[{name:"id_order_history",label:"ID",filter:!0,table_name:"main"},{name:"id_order",label:"ID \u0437\u0430\u043a\u0430\u0437\u0430",filter:!0,table_name:"main"},{name:"old_state_name",label:"\u0421\u0442\u0430\u0440\u044b\u0439 \u0441\u0442\u0430\u0442\u0443\u0441",filter:!1,table_name:"osl"},{name:"state_name",label:"\u041d\u043e\u0432\u044b\u0439 \u0441\u0442\u0430\u0442\u0443\u0441",filter:!0,table_name:"nothing"},{name:"comment",label:"\u041f\u0440\u0438\u0447\u0438\u043d\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f",filter:!0,filter_condition:"like",table_name:"main"},{name:"employee",label:"\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c",filter:!0,table_name:"nothing"},{name:"date_add",label:"\u0414\u0430\u0442\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f",filter:!0,table_name:"main"}],order_histories:[],total_order_histories:void 0,total_pages:void 0,current_page:1,count:20,sort:{table_name:"main",orderby:"id_order_history",orderway:"DESC"},isFetching:!1},I=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:R,r=arguments.length>1?arguments[1]:void 0;switch(r.type){case v:e=Object(j.a)(Object(j.a)({},t),{},{initialized:r.initialized});break;case y:e=Object(j.a)(Object(j.a)({},t),{},{order_histories:Object(m.a)(r.order_histories)});break;case x:e=Object(j.a)(Object(j.a)({},t),{},{total_order_histories:r.total_number});break;case w:e=Object(j.a)(Object(j.a)({},t),{},{current_page:r.current_page});break;case T:e=Object(j.a)(Object(j.a)({},t),{},{isFetching:r.isFetching});break;case C:e=Object(j.a)(Object(j.a)({},t),{},{total_pages:r.total_pages});break;case S:e=Object(j.a)(Object(j.a)({},t),{},{sort:Object(j.a)({},r.sort)});break;default:e=Object(j.a)({},t)}return e},k=function(){return{type:v,initialized:!0}},N=function(e){return{type:C,total_pages:e}},H=function(e){return{type:T,isFetching:e}},E=function(e){return{type:S,sort:e}},A=function(e,t){return function(){var r=Object(b.a)(_.a.mark((function r(a){var n,i;return _.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,g.getOrdersHistories(e);case 2:(n=r.sent).order_histories&&(a((s=n.order_histories,{type:y,order_histories:s})),a((o=n.count,{type:x,total_number:o})),i=Math.ceil(n.count/t),a(N(i)));case 4:case"end":return r.stop()}var o,s}),r)})));return function(e){return r.apply(this,arguments)}}()},P=r(34),L=Object(u.combineReducers)({indexReducer:I}),D=Object(u.createStore)(L,Object(P.composeWithDevTools)(Object(u.applyMiddleware)(p.a))),F=r(12),z=r(9),U=r(5),B=r.n(U),J=(r(31),r(4)),M=r.n(J),G=r(1),W=function(e){var t=e.id_order_history,r=e.employee,a=e.state_name,n=e.old_state_name,i=e.id_order,o=e.comment,s=e.date_add,c=e.odd_even,l=function(){var e=Object(b.a)(_.a.mark((function e(){return _.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(G.jsxs)("div",{className:B()(c,M.a.orderHistoryRow),children:[Object(G.jsx)("div",{className:B()(M.a.id,M.a.cell),children:t}),Object(G.jsx)("div",{className:B()(M.a.id,M.a.cell),children:i}),Object(G.jsx)("div",{className:B()(M.a.id,M.a.cell),children:n}),Object(G.jsx)("div",{className:B()(M.a.id,M.a.cell),children:a}),Object(G.jsx)("div",{className:B()(M.a.id,M.a.cell),onClick:l,"data-id-order-history":t,children:o}),Object(G.jsx)("div",{className:B()(M.a.id,M.a.cell),children:r}),Object(G.jsx)("div",{className:B()(M.a.id,M.a.cell,M.a.lastCell),children:s})]})},q=Object(F.b)((function(e,t){return{order_history:t.order_history,odd_even:t.odd_even}}),{})((function(e){var t=e.order_history,r=e.odd_even;return Object(G.jsx)(W,{id_order_history:t.id_order_history,employee:t.employee,state_name:t.state_name,old_state_name:t.old_state_name,id_order:t.id_order,comment:t.comment,date_add:t.date_add,odd_even:r})})),V=r(8),Y=r.n(V),Q=r(10),K=r.n(Q),X=function(e){var t=e.updateData,r=e.count,a=e.currentPage,n=e.sort,i=e.totalPages,o=0,s=7;a>3&&(o=a-3,s=a+2);for(var c=function(e){t(e,r,n)},l=[],d=1;d<=i;d++)l.push(d);return Object(G.jsx)("div",{className:K.a.pagination,children:Object(G.jsxs)("ul",{className:K.a.paginationList,children:[Object(G.jsx)("li",{className:B()(K.a.paginationListItem,Object(z.a)({},K.a.hidden,1===a)),onClick:function(){c(1)},children:"\u22d8"}),l.slice(o,s).map((function(e){return Object(G.jsx)("li",{className:K.a.paginationListItem+" "+(a===e?K.a.paginationListItemCurrent:""),onClick:function(){c(e)},children:e})})),Object(G.jsx)("li",{className:K.a.paginationListItem+" "+(a===l.length?K.a.hidden:""),onClick:function(){c(l.length)},children:"\u22d9"})]})})},Z=r(22),$=r.n(Z),ee=buildURL+"static/media/loader.04f3b828.svg",te=function(){return Object(G.jsx)("div",{className:$.a.preloader,children:Object(G.jsx)("img",{src:ee,alt:"Loading...",className:$.a.preloaderImage})})},re=function(e){Object(l.a)(r,e);var t=Object(d.a)(r);function r(){var e;Object(s.a)(this,r);for(var a=arguments.length,n=new Array(a),i=0;i<a;i++)n[i]=arguments[i];return(e=t.call.apply(t,[this].concat(n))).changeSort=function(t){if(t.target.dataset.sortFilter){var r={table_name:t.target.dataset.tableName,orderby:t.target.dataset.sortName,orderway:t.target.dataset.sortWay};e.props.changeSort(r,e.props.current_page,e.props.count)}},e}return Object(c.a)(r,[{key:"render",value:function(){var e=this;return this.props.isFetching?Object(G.jsx)(te,{}):Object(G.jsxs)("div",{children:[Object(G.jsxs)("div",{className:B()(Y.a.historyTable),children:[Object(G.jsx)("div",{className:Y.a.tableHeader,children:this.props.table_columns.map((function(t,r){var a;return Object(G.jsx)("div",{className:B()(Y.a.headerCell,Object(z.a)({},Y.a.headerCellActive,e.props.sort.orderby===t.name),Object(z.a)({},Y.a.lastCell,e.props.table_columns.length-1===r)),children:Object(G.jsxs)("div",{className:B()(Y.a.headerCellText),"data-table-name":t.table_name,"data-sort-filter":!!t.filter&&t.filter,"data-sort-name":t.name,"data-sort-way":e.props.sort.orderby===t.name&&"ASC"===e.props.sort.orderway?"DESC":"ASC",onClick:e.changeSort,children:[t.label,t.filter?Object(G.jsx)("div",{className:B()(Y.a.sortButton,(a={},Object(z.a)(a,Y.a.sortAsc,e.props.sort.orderby===t.name&&"ASC"===e.props.sort.orderway),Object(z.a)(a,Y.a.sortDesc,e.props.sort.orderby===t.name&&"DESC"===e.props.sort.orderway),a)),children:"\u25bc"}):""]},r)})}))}),this.props.order_histories.map((function(e,t){return Object(G.jsx)(q,{order_history:e,odd_even:t%2===0?"even":"odd"},e.id)}))]}),Object(G.jsx)(X,{updateData:this.props.updateData,count:this.props.count,currentPage:this.props.current_page,totalPages:this.props.total_pages,sort:this.props.sort})]})}}]),r}(n.a.Component),ae=function(e){Object(l.a)(r,e);var t=Object(d.a)(r);function r(){var e;Object(s.a)(this,r);for(var a=arguments.length,n=new Array(a),i=0;i<a;i++)n[i]=arguments[i];return(e=t.call.apply(t,[this].concat(n))).onChangeSort=function(t,r,a){e.props.changeSort(t,r,a)},e}return Object(c.a)(r,[{key:"render",value:function(){return Object(G.jsx)(re,{table_columns:this.props.table_columns,order_histories:this.props.order_histories,current_page:this.props.current_page,total_pages:this.props.total_pages,count:this.props.count,sort:this.props.sort,isFetching:this.props.isFetching,changeSort:this.onChangeSort,updateData:this.props.updateData})}}]),r}(n.a.Component),ne={updateData:function(e,t,r){return function(){var a=Object(b.a)(_.a.mark((function a(n){var i,o,s;return _.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:i=parseInt((e-1)*t-1),o={limit:"".concat(i,",").concat(t)},1===parseInt(e)&&(o={limit:"".concat(t)}),o.sort="[".concat(r.table_name,"|").concat(r.orderby,"-").concat(r.orderway,"]"),n(H(!0)),s=n(A(o,t)),Promise.all([s]).then((function(){n(H(!1)),n({type:w,current_page:e})}));case 7:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()},changeSort:function(e,t,r){return function(){var a=Object(b.a)(_.a.mark((function a(n){var i,o,s;return _.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:i=parseInt((t-1)*r-1),o={limit:"".concat(i,",").concat(r)},1===parseInt(t)&&(o={limit:"".concat(r)}),o.sort="[".concat(e.table_name,"|").concat(e.orderby,"-").concat(e.orderway,"]"),n(H(!0)),s=n(A(o,r)),Promise.all([s]).then((function(){n(H(!1)),n(E(e))}));case 7:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()}},ie=Object(F.b)((function(e){return{table_columns:e.indexReducer.table_columns,order_histories:e.indexReducer.order_histories,current_page:e.indexReducer.current_page,total_pages:e.indexReducer.total_pages,count:e.indexReducer.count,sort:e.indexReducer.sort,isFetching:e.indexReducer.isFetching}}),ne)(ae),oe=function(e){Object(l.a)(r,e);var t=Object(d.a)(r);function r(){var e;Object(s.a)(this,r);for(var a=arguments.length,n=new Array(a),i=0;i<a;i++)n[i]=arguments[i];return(e=t.call.apply(t,[this].concat(n))).catchAllUnhandledErrors=function(e){alert(e.reason)},e}return Object(c.a)(r,[{key:"componentDidMount",value:function(){var e={limit:this.props.count,sort:"[".concat(this.props.sort.table_name,"|").concat(this.props.sort.orderby,"-").concat(this.props.sort.orderway,"]")};this.props.initializeApp(e,this.props.count),window.addEventListener("unhandledrejection",this.catchAllUnhandledErrors)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("unhandledrejection",this.catchAllUnhandledErrors)}},{key:"render",value:function(){return this.props.isInitialized?Object(G.jsx)("div",{children:Object(G.jsx)(ie,{})}):Object(G.jsx)(te,{})}}]),r}(n.a.Component),se={initializeApp:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;return function(){var r=Object(b.a)(_.a.mark((function r(a){var n;return _.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:n=a(A(e,t)),Promise.all([n]).then((function(){a(k())}));case 2:case"end":return r.stop()}}),r)})));return function(e){return r.apply(this,arguments)}}()}},ce=Object(F.b)((function(e){return{isInitialized:e.indexReducer.initialized,count:e.indexReducer.count,sort:e.indexReducer.sort}}),se)(oe),le=function(e){return Object(G.jsx)(F.a,{store:D,children:Object(G.jsx)(ce,{store:D})})},de=function(e){e&&e instanceof Function&&r.e(3).then(r.bind(null,69)).then((function(t){var r=t.getCLS,a=t.getFID,n=t.getFCP,i=t.getLCP,o=t.getTTFB;r(e),a(e),n(e),i(e),o(e)}))};o.a.render(Object(G.jsx)(le,{}),document.getElementById("root")),de()},8:function(e,t,r){e.exports={historyTable:"HistoryTable_historyTable__2sGIp",tableHeader:"HistoryTable_tableHeader__285qJ",headerCell:"HistoryTable_headerCell__37PUS",headerCellActive:"HistoryTable_headerCellActive__1CxO0",headerCellText:"HistoryTable_headerCellText__1Hj3U",lastCell:"HistoryTable_lastCell__2lddY",sortButton:"HistoryTable_sortButton__3zyt5",sortAsc:"HistoryTable_sortAsc__3rwoS",sortDesc:"HistoryTable_sortDesc__3Cg0W"}}},[[68,1,2]]]);
//# sourceMappingURL=main.408864f4.chunk.js.map