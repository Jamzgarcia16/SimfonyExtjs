
////////////////////////////////////////////////////////////////////
////////////////////////REGIONES/////////////////////////////////
///////////////////////////////////////////////////////////////// 
var TextNumero_Piso = crear_text_field(fieldLabel="Numero Piso", id="IDTextNumero_Piso", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='Ej: 1 = Piso 1');


var TextNumero_Puesto = crear_text_field(fieldLabel="Numero Puesto", id="IDTextNumero_Puesto", labelWidth=90, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='un valor de 1 a 50');

var panel_estructura_parqueadero = crear_panel(titulo="ESTRUCUTURA PARQUEDERO", id="IDpanel_estructura_parqueadero", width=600, 
                                                        height=135, margin='0 0 0 0', layout_type="column",  
                                                        items=[TextNumero_Piso,TextNumero_Puesto], bodyStyle ="", border=false, autoScroll=false, hidden=false, 
                                                        disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                        array_eventos=[], layout_align=null, layout_pack=null);
 
var Text_Placa_Vehiculo = crear_text_field(fieldLabel="Placa Vehiculo", id="IDText_Placa_Vehiculo", labelWidth=110, width="19%", 
                                              margin='10 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_guion_letras_sin_espacios", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Color_Vehiculo = crear_text_field(fieldLabel="Color Vehiculo", id="IDText_Color_Vehiculo", labelWidth=110, width="19%", 
                                              margin='10 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_guion_letras_sin_espacios", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Ciudad_Origen_placa = crear_text_field(fieldLabel="Ciudad Origen Placa", id="IDText_Ciudad_Origen_placa", labelWidth=110, width="19%", 
                                              margin='10 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_guion_letras_sin_espacios", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');


var panel_Facturacion = crear_panel(titulo="FACTURACION PARQUEDERO", id="IDpanel_Facturacion", width="50%", 
                                                        height=155, margin='0 0 0 0', layout_type="column",  
                                                        items=[Text_Placa_Vehiculo,Text_Color_Vehiculo,Text_Ciudad_Origen_placa], bodyStyle ="", border=false, autoScroll=false, hidden=false, 
                                                        disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                        array_eventos=[], layout_align=null, layout_pack=null);

var ComboBoxTablaTipoDeCobro =  crear_combobox(fieldLabel="Tabla 3 Tipo de Cobro", labelWidth=60, width=260, 
                                        displayField="nombre_tipo_cobro", valueField="cod_tipo_cobro", 
                                        id="ComboBoxTablaTipoDeCobro", store=StoreComboBoxTablaTipoDeCobro, 
                                        margin="10 0 0 20", allowBlank=false, editable=false, 
                                        forceSelection= true, hidden=false, disabled=false, queryMode = 'local', typeAhead=false, triggerAction = 'all', 
                                        hideTrigger= false, readOnly=false, labelAlign="left", labelPad=10, cls='', loadingText= 'Buscando...', 
                                        emptyText = '¡No se encontraron registros!', cls_listConfig='', getInnerTpl='<center>{nombre_genero}</center>', 
                                        tooltip="", inputAttrTpl='center', tpl = "", enableKeyEvents=false, array_eventos=[], displayTpl='', 
                                        labelSeparator=':');

var panel_Tipo_cobro = crear_panel(titulo="TIPO DE COBRO", id="IDpanel_Tipo_cobro", width="30%", 
                                                        height=135, margin='0 0 0 0', layout_type="column",  
                                                        items=[ComboBoxTablaTipoDeCobro], bodyStyle ="", border=false, autoScroll=false, hidden=false, 
                                                        disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                        array_eventos=[], layout_align=null, layout_pack=null);


var formulario_parqueadero = Ext.create('Ext.form.Panel', {
    renderTo: document.body,
    title: 'Formulario Pricipal Parqueadero Parking_Security S.A.S',
    height: 620,
    width: "100%",
    autoScroll: true,
    bodyPadding: 20,
    defaultType: 'textfield',
   // layout: 'hbox',
    items: [ panel_estructura_parqueadero,panel_Facturacion,panel_Tipo_cobro],
    buttons: [{
        text: 'Guardar',
        handler: function(  ) {
            var form = this.up('form').getForm();
            //if (form.isValid()) {
                form.submit({
                     url: 'URLFormularioParqueadero', 
                    success: function(form, action) {
                       Ext.Msg.alert('Registro Insertado', 'exito');
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Fallo insertar datos', 'fallo');
                    }
                });
            //}
        }
    }],
});


var RegionCentralConfiguracionjamzBundle  = crear_panel(titulo='', id='IDRegionCentralConfiguracionjamzBundle', width='100%', 
                                           height='100%', margin='0 0 0 0', layout="vbox",  
                                           items=[ formulario_parqueadero], 
                                           bodyStyle ="", border=false, autoScroll=true, hidden=false, disabled=false, html="", 
                                           region="center", collapsed=false, collapsible=false, titleAlign="left", array_eventos=[]); 

////////////////////////////////////////////////////////////////////////
////////////////VENTANA PRINCIPAL CON TODOS LOS CONTENEDORES////////////
////////////////////////////////////////////////////////////////////////
Ext.onReady(function(){
var ContenedorPrincipalConfiguracionModuloJamzBundle = Ext.create('Ext.container.Viewport',{

id:'IDContenedorPrincipal',
layout:'border',
items:
      [RegionCentralConfiguracionjamzBundle]
});


});
 
