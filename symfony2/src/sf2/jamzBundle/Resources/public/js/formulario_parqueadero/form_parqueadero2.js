
////////////////////////////////////////////////////////////////////
////////////////////////REGIONES/////////////////////////////////
///////////////////////////////////////////////////////////////// 

var form_parquedaero2 = Ext.create('Ext.form.Panel', {
    renderTo: document.body,
    title: 'User Form',
    height: 620,
    width: 390,
    autoScroll: true,
    bodyPadding: 20,
    defaultType: 'textfield',
    items: [
        {
            fieldLabel: 'Hola Mundo Desde',
            name: 'id_usuario'
        },
        {
            fieldLabel: 'Ext JS en 2 cajas de Texto',
            name: 'nombre_usuario'
        }
    ],
    buttons: [{
        text: 'Guardar',
        handler: function(  ) {
            var form = this.up('form').getForm();
            if (form.isValid()) {
                form.submit({
                     url: 'SaludarAction', 
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
                                           items=[ form_parquedaero2], 
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