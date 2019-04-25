var fmPublicoLabelTituloConvocatoria = crear_label(id="IDfmPublicoLabelTituloConvocatoria", text="", width="100%", height=50, margin='30 0 0 0', hidden= false, 
                                                   disabled=false, style_font= 'Georgia', style_fontsize= '25px', style_color='red', html='', 
                                                   cls='', tooltip="", array_eventos=[]);



                                                    
var fmPublicoTextResolucionConvocatoria =  crear_text_field(fieldLabel="Número de Resolución", id="IDfmPublicoTextResolucionConvocatoria", labelWidth=150, width=300, 
                                                   margin='10 0 0 30', value= "", hidden=false, disabled=false, allowBlank=false, readOnly=true, vtype="", 
                                                   inputAttrTpl="center", labelAlign="left", labelPad=15, maxLength=10, minLength=1, 
                                                   enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                                   inputType='text', emptyText='');

var fmPublicoTextFechaResolucionConvocatoria =  crear_calendario(fieldLabel="Fecha de Resolución", id="IDfmPublicoTextFechaResolucionConvocatoria", labelWidth=150, width=300, 
                                                        margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                                        labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                                        array_eventos=[], enableKeyEvents =false);
                                                   
var fmPublicoTextEnteCreadoraResolucionConvocatoria =  crear_text_field(fieldLabel="Ente Creador de la Resolución", id="IDfmPublicoTextEnteCreadoraResolucionConvocatoria", 
                                                   labelWidth=210, width=400, margin='10 0 0 30', value= "", hidden=false, disabled=false, allowBlank=false, 
                                                   readOnly=true, vtype="", inputAttrTpl="center", labelAlign="left", labelPad=15, maxLength=50, minLength=1, 
                                                   enableKeyEvents=false, enforceMaxLength=true, tooltip="", array_eventos=[], labelSeparator=':', 
                                                   inputType='text', emptyText='');


var PanelFormularioPublicoResolucion = crear_panel(titulo="DATOS DE RESOLUCIÓN", id="IDPanelFormularioPublicoResolucion", width="100%", height=100, margin='0 0 0 0', 
                                                  layout_type="hbox",  
                                                  items=[fmPublicoTextResolucionConvocatoria, fmPublicoTextFechaResolucionConvocatoria, fmPublicoTextEnteCreadoraResolucionConvocatoria], 
                                                  bodyStyle ="", border=true, autoScroll=true, hidden=false, 
                                                  disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                  array_eventos=[],layout_align="center", layout_pack="");  





var fmPublicoConvocatoriaTextFechaInicioAperturaConvocatoria =  crear_calendario(fieldLabel="Fecha Inicio Apertura Convocatoria", id="IDfmPublicoConvocatoriaTextFechaInicioAperturaConvocatoria", 
                                                                                 labelWidth=240, width=370, margin="10 0 0 30", value="", hidden=false, 
                                                                                 disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                                                                 labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, 
                                                                                 disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                                                                 array_eventos=[], enableKeyEvents =false);

var fmPublicoConvocatoriaTextFechaFinAperturaConvocatoria =  crear_calendario(fieldLabel="Fecha Fin Apertura Convocatoria", id="IDfmPublicoConvocatoriaTextFechaFinAperturaConvocatoria", labelWidth=240, width=370, 
                                                        margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                                        labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                                        array_eventos=[], enableKeyEvents =false);
                                                        

var fmPublicoConvocatoriaTextFechaInicioProcesoConvocatoria =  crear_calendario(fieldLabel="Fecha Inicio Proceso Convocatoria", id="IDfmPublicoConvocatoriaTextFechaInicioProcesoConvocatoria", labelWidth=240, width=370, 
                                                        margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                                        labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                                        array_eventos=[], enableKeyEvents =false);

var fmPublicoConvocatoriaTextFechaFinProcesoConvocatoria =  crear_calendario(fieldLabel="Fecha Fin Proceso Convocatoria", id="IDfmPublicoConvocatoriaTextFechaFinProcesoConvocatoria", labelWidth=240, width=370, 
                                                        margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                                        labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                                        array_eventos=[], enableKeyEvents =false);
                                                                                                                
var fmPublicoConvocatoriaTextFechaLimitePago =  crear_calendario(fieldLabel="Fecha Limite Pago", id="IDfmPublicoConvocatoriaTextFechaLimitePago", labelWidth=130, width=290, 
                                            margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                            labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                            array_eventos=[], enableKeyEvents =false);

var fmPublicoConvocatoriaTextFechaPublicaResultados =  crear_calendario(fieldLabel="Fecha Publicación Resultados", id="IDfmPublicoConvocatoriaTextFechaPublicaResultados", labelWidth=230, width=370, 
                                            margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                            labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                            array_eventos=[], enableKeyEvents =false);

var fmPublicoConvocatoriaTextFechaComite =  crear_calendario(fieldLabel="Fecha Comite", id="IDfmPublicoConvocatoriaTextFechaComite", labelWidth=100, width=240, 
                                            margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                            labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                            array_eventos=[], enableKeyEvents =false);
                                            
                                                        
var fmPublicoTextFechaCharlaInformativa =  crear_calendario(fieldLabel="Fecha de charla informativa", id="IDfmPublicoTextFechaCharlaInformativa", labelWidth=200, width=350, 
                                            margin="10 0 0 30", value="", hidden=false, disabled=false, editable=false, readOnly = true, labelAlign="left", 
                                            labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=false, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                                            array_eventos=[], enableKeyEvents =false);
  

var PanelFormularioPublicoFechasImportantes = crear_panel(titulo="FECHA IMPORTANTES A TENER EN CUENTA", id="IDPanelFormularioPublicoFechasImportantes", width="100%", height=200, margin='5 0 0 0', 
                                                  layout_type="column",  
                                                  items=[fmPublicoConvocatoriaTextFechaInicioAperturaConvocatoria, fmPublicoConvocatoriaTextFechaFinAperturaConvocatoria,
                                                         fmPublicoConvocatoriaTextFechaInicioProcesoConvocatoria, fmPublicoConvocatoriaTextFechaFinProcesoConvocatoria,
                                                         fmPublicoConvocatoriaTextFechaLimitePago, fmPublicoConvocatoriaTextFechaPublicaResultados,
                                                         fmPublicoConvocatoriaTextFechaComite, fmPublicoTextFechaCharlaInformativa
                                                         ], 
                                                  bodyStyle ="", border=true, autoScroll=true, hidden=false, 
                                                  disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                  array_eventos=[],layout_align="center", layout_pack=""); 


var fmPublicoConvocatoriaDescripcionConvocatoria = crear_textArea(id="IDfmPublicoConvocatoriaDescripcionConvocatoria", width="100%", height="100%", margin="0 0 0 0", value_inicial="", 
                                                  labelAlign="", labelPad=10, readOnly=true, fieldLabel="", labelWidth= 1, 
                                                  style="text-align: left;",fontFamily='arial', fontSize='12px', color='black', textAlign='left', autoScroll=true, 
                                                  border=false, allowBlank=false, hidden= false, disabled=false, maxLength=100000, enforceMaxLength=false, tooltip="", 
                                                  emptyText='', array_eventos=[]);
 
var PanelformularioPublicoDescripcion = crear_panel(titulo="DESCRIPCIÓN DE LA CONVOCATORIA", id="idPanelformularioPublicoDescripcion", width="100%", height=300, margin='0 0 0 0', 
                                                  layout_type="vbox",  
                                                  items=[fmPublicoConvocatoriaDescripcionConvocatoria], 
                                                  bodyStyle ="", border=true, autoScroll=false, hidden=false, 
                                                  disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                  array_eventos=[],layout_align="center", layout_pack=""); 


var fmPublicoConvocatoriaObservacionConvocatoria = crear_textArea(id="IDfmPublicoConvocatoriaObservacionConvocatoria", width="100%", height="100%", margin="0 0 0 0", value_inicial="", 
                                                  labelAlign="", labelPad=10, readOnly=true, fieldLabel="", labelWidth= 1, 
                                                  style="text-align: left;",fontFamily='arial', fontSize='12px', color='black', textAlign='left', autoScroll=true, 
                                                  border=false, allowBlank=false, hidden= false, disabled=false, maxLength=100000, enforceMaxLength=false, tooltip="", 
                                                  emptyText='', array_eventos=[]);
 
var PanelformularioPublicoObservacion = crear_panel(titulo="OBSERVACIONES IMPORTANTES", id="idPanelformularioPublicoObservacion", width="100%", height=300, margin='0 0 0 0', 
                                                  layout_type="vbox",  
                                                  items=[fmPublicoConvocatoriaObservacionConvocatoria], 
                                                  bodyStyle ="", border=true, autoScroll=false, hidden=false, 
                                                  disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="left", 
                                                  array_eventos=[],layout_align="center", layout_pack=""); 



var ComboBoxConvocatoriaVigentes = crear_combobox(fieldLabel="Convocatorias Vigentes", labelWidth=150, width="100%", displayField="nombre_convocatoria", 
                        valueField="codigo_convocatoria", id="IDComboBoxConvocatoriaVigentes", store=StoreComboBoxConvocatoriasVigentes, margin="5 0 0 5", 
                        allowBlank=true, editable=false, forceSelection= true, 
                        hidden=false, disabled=false, queryMode = 'local', typeAhead=false, triggerAction = 'all', hideTrigger= false, readOnly=false, 
                        labelAlign="left", labelPad=10, cls='', loadingText= 'Buscando...', emptyText = '¡No se encontraron registros!', cls_listConfig='', 
                        getInnerTpl='<center>{nombre_convocatoria}</center>', tooltip="", inputAttrTpl='center', tpl = "", enableKeyEvents=false, 
                        array_eventos=[{select:true}], 
                        displayTpl='', labelSeparator=':');

var ventana_seleccionar_convocatoria_vigente = crear_window(title="Convocatorias Vigentes", id="IDventana_seleccionar_convocatoria_vigente", height=100, width=900, 
                      layout='vbox', hidden=false, resizable=false, closable=true, background='#FFFFFF', items=[ComboBoxConvocatoriaVigentes], 
                      array_eventos=[{show:true, close:true}], autoScroll=false);


var BotonPostularPersonaAConvocatoria = crear_boton(text="Postularse", id="IDBotonPostularPersonaAConvocatoria", margin="0 0 0 0", hidden=true, 
                                                   disabled=false, tooltip="", ancho=200, alto=30, array_eventos=[{click:true}], cls='', scale= 'small', 
                                                   icon=null, iconCls='x-fa fa-address-card-o', iconAlign='left', index="");
        
var BotonNuevaPostulacion = crear_boton(text="Seleccionar Convocatoria", id="IDBotonNuevaPostulacion", margin="0 0 0 0", hidden=true, 
                                                   disabled=false, tooltip="", ancho=200, alto=30, array_eventos=[{click:true}], cls='', scale= 'small', 
                                                   icon=null, iconCls='x-fa fa-plus-circle', iconAlign='left', index="");
                                                   
                                                   
var FormularioPublicoConvocatoria =  Ext.create('Ext.form.Panel', {
id: "IDFormularioPublicoConvocatoria",
width: "100%",
frame: true,
title: "",
autoScroll: true,
border: true,
margin: "0 0 0 0",
buttonAlign: "center",
defaults: {
  anchor: '100%',
  allowBlank: false,
  msgTarget: 'side',
  labelWidth: 50
},
layout:"vbox",
items:[fmPublicoLabelTituloConvocatoria, PanelFormularioPublicoResolucion, PanelFormularioPublicoFechasImportantes,
       PanelformularioPublicoDescripcion, PanelformularioPublicoObservacion],
buttons:[BotonPostularPersonaAConvocatoria, BotonNuevaPostulacion]
});