// Formulario de Prueba Funcionando ok.
//No Tocar. 15/04/2019. # Trabajar con copias en otras URLS, chao de aca.
// implementar metodo de borrar y actualizar en dos botones independientes llamanados 2 urls diferentes. #pendiente!!


var Text_CC_Cliente = crear_text_field(fieldLabel="CC Cliente", id="IDText_CC_Cliente", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');   

var Text_Nombre_Cliente = crear_text_field(fieldLabel="Nombre_Cliente", id="IDText_Nombre_Cliente", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="", 
                                           inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='Pepito');

var Text_Correo_Cliente = crear_text_field(fieldLabel="Correo Cliente", id="IDText_Correo_Cliente", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='pepito@gmail.co');

var Text_Contrasena = crear_text_field(fieldLabel="Password Cliente", id="IDText_Contrasena", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Num_1 = crear_text_field(fieldLabel="Numero 1", id="IDText_Num_1", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Num_2 = crear_text_field(fieldLabel="Numero 2", id="IDText_Num_2", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Valor_Venta = crear_text_field(fieldLabel="Valor_Venta", id="IDText_Valor_Venta", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Valor_Venta = crear_text_field(fieldLabel="Valor_Venta", id="IDText_Valor_Venta", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Numero_P = crear_text_field(fieldLabel="Numero P", id="IDText_Numero_P", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');

var Text_Base = crear_text_field(fieldLabel="Base", id="IDText_Base", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText=''); 

var Text_Numero_Inverso = crear_text_field(fieldLabel="Numero Inverso", id="IDText_Numero_Inverso", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText=''); 



var panel_cliente = crear_panel(titulo="Formulario", id="IDpanel_cliente", width="100%", 
                                                        height=240, margin='0 0 0 0', layout_type="column",  
                                                        items=[Text_CC_Cliente,Text_Nombre_Cliente,Text_Correo_Cliente,Text_Contrasena,Text_Num_1,Text_Num_2,Text_Valor_Venta,Text_Numero_P,Text_Base,Text_Numero_Inverso], bodyStyle ="", border=false, autoScroll=false, hidden=false, 
                                                        disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                        array_eventos=[], layout_align=null, layout_pack=null);
 
var Text_Capital = crear_text_field(fieldLabel="Capital", id="IDTtext_Capital", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');   

var Text_Tasa_De_Interes = crear_text_field(fieldLabel="Tasa de Interes", id="IDText_Tasa_De_Interes", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText='');   

var Text_Tiempo = crear_text_field(fieldLabel="Tiempo_Credito", id="IDText_Tiempo", labelWidth=110, width=250, 
                                              margin='20 0 0 20', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=false, 
                                              vtype="solo_numeros_especios_guines", 
                                              inputAttrTpl="center", labelAlign="right", labelPad=15, maxLength=50, minLength=1, 
                                              enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                              inputType='text', emptyText=''); 

var Panel_Simulador_Credito = crear_panel(titulo="Simulador de Credito", id="IDPanel_Simulador_Credito", width="100%", 
                                                        height=300, margin='0 0 0 0', layout_type="column",  
                                                        items=[Text_Capital,Text_Tasa_De_Interes,Text_Tiempo], bodyStyle ="", border=false, autoScroll=false, hidden=false, 
                                                        disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                        array_eventos=[], layout_align=null, layout_pack=null);



////////////////////////////////////////////////////////////////////
////////////////////////REGIONES/////////////////////////////////
///////////////////////////////////////////////////////////////// 

var formulario1 = Ext.create('Ext.form.Panel', {
    renderTo: document.body,
    title: 'User Form',
    height: 420,
    width: "100%",
    autoScroll: true,
    bodyPadding: 20,
    defaultType: 'textfield',
    items: [ panel_cliente,Panel_Simulador_Credito ],
    buttons: [{
        text: 'Guardar',
        handler: function(  ) {
            var form = this.up('form').getForm();
            if (form.isValid()) {
                form.submit({
                     url: 'URLGuadarFormulario', 
                    success: function(form, action) {
                       Ext.Msg.alert('Registro Insertado', action.result.msg);
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Fallo insertar datos', action.result.msg);
                    }
                });
            }
        }
    }],
});



var RegionCentralConfiguracionjamzBundle  = crear_panel(titulo='', id='IDRegionCentralConfiguracionjamzBundle', width='100%', 
                                           height='100%', margin='0 0 0 0', layout="vbox",  
                                           items=[ formulario1], 
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
 
