//03- 04- 2018
//Ext.util.Format.dateRenderer('Y-m-d')
var today = new Date();
var yr = today.getFullYear();
Ext.tip.QuickTipManager.init(); 

function pasar_a_minuscula(cadena){
    return cadena.toLowerCase();
}


function formatDate(value) {
   return value ? Ext.Date.dateFormat(value, 'Y-m-d') : ''; 
}

function modificar_fecha(fecha, dias) {//para quitar dias es con un numero negativo ejemplo: -5;
        return Ext.Date.add(new Date(fecha), Ext.Date.DAY, dias);
};

function modificar_fechaV2(fecha, dias) {//para quitar dias es con un numero negativo ejemplo: -5;
        return Ext.Date.add(fecha, Ext.Date.DAY, dias);
};

function modificar_anos_de_la_fecha(fecha, anos) {//para quitar años es con un numero negativo ejemplo: -5;
        return Ext.Date.add(new Date(fecha), Ext.Date.YEAR, anos);
};

function retornar_arreglo_valores_pantalla(index=""){
var datos_pantalla = {ancho: screen.width,
                      alto: screen.height,
                      centro_ancho: screen.width / 2,
                      centro_alto: screen.height / 2
                     };    
  if (index === "" || index === null)
    {return datos_pantalla;}
  else
    {switch(index) {
        case "ancho":
           return datos_pantalla.ancho;
           break;
        case "alto":
           return datos_pantalla.alto;
           break;  
        case "centro_ancho":
           return datos_pantalla.centro_ancho;
           break;       
        case "centro_alto":
           return datos_pantalla.centro_alto;
           break;       
      }
    }  
}

function retornar_desplazamiento_x_para_centrar_panel_dentro_de_otro (ancho_panel_interno, ancho_panel_contenedor = screen.width, id_objeto=""){
if (id_objeto === "" && id_objeto === null)
 {var x = (ancho_panel_contenedor - ancho_panel_interno) / 2;
  return x;   
 }
else
{ var x = (Ext.getCmp(id_objeto).getWidth() - ancho_panel_interno) / 2;
  return x;   
}   
}

function retornar_coordenada_centrado_a_lo_ancho(valor=0, id_objeto=""){
 var pantalla = retornar_arreglo_valores_pantalla();
 if (parseInt(valor) !== 0)
    {mitad_objeto = valor / 2;}
 else{
     if (id_objeto !== "")
       {var mitad_objeto = Ext.getCmp(id_objeto).getWidth() / 2;}
 }
    
 var centro_objeto =   pantalla.centro_ancho - mitad_objeto;
  
    return centro_objeto;
}

function deseleccionar_de_una_grid(grid){
grid.getSelectionModel().deselectAll();
}

function devuelve_header_de_una_columna(grid, colIndex){
  header = grid.headerCt.getGridColumns()[colIndex]; 
  return header;
}              

function reconfigurar_tabla(id_tabla, id_store, columnas){
  Ext.getCmp(id_tabla).reconfigure(Ext.data.StoreManager.lookup(id_store),  columnas);       
}


function destroy_objeto(id){
  if (Ext.getCmp(id))
     {Ext.getCmp(id).destroy();}   
}


//retorna el indice donde se encuentra el elemento si no se encuentra se devuelve un -1
function find_en_store(store, fieldName="", value="", startIndex=0, anyMatch=false, caseSensitive=false, exactMatch=false){
    return store.find(fieldName, value, startIndex, anyMatch, caseSensitive, exactMatch);    
}

function crear_sort_en_store (store, field, sentido="DESC", id_store=""){
 if (id_store === "")
    {store.sort(field, sentido);}
 else
   {Ext.data.StoreManager.lookup(id_store).sort(field, sentido);} 
}

function crear_filter_en_un_store (clearFilter=false, store, field, valor, formato="toUpperCase", id_store="", comparar=false)
{ if (id_store !== "")
    {store = Ext.data.StoreManager.lookup(id_store);}
    
    
  if (!clearFilter)
    {
     if (!comparar)   
       {if (formato ==="toUpperCase")
           {store.filterBy(
                 function(record, id)
             {return record.get(field).indexOf(valor.toUpperCase()) !== -1;}
            );      
           }
        else if (formato ==="toLowerCase")  
                {store.filterBy(
                  function(record, id)
               {return record.get(field).indexOf(valor.toLowerCase()) !== -1;}
                  );      
                }
             else
                {store.filterBy(
                   function(record, id)
               {return record.get(field).indexOf(valor) !== -1;}
                  );      
                }
       }
      else
        {  store.filterBy(
                       function(record, id)
                  {return record.get(field) == valor ;}
                   );  
        }
     }
  else
    {store.clearFilter();}
}


function crear_objeto_store(model, id, auto = false, url = '', array_eventos=[], extraParams=[], rootProperty='', totalProperty=''){
 //ejemplos para crear sortes y filter   
 /*   sorters: [{
         property: 'age',
         direction: 'DESC'
     }, {
         property: 'firstName',
         direction: 'ASC'
     }],

     filters: [{
         property: 'firstName',
         value: /Peter/
     }]*/   
    
var store  =  Ext.create ('Ext.data.Store',{
  model: model,
  storeId : id,
  autoLoad: auto,

  proxy:{type: 'ajax',
         url:  url, 
         extraParams: {extraParams: Ext.JSON.encode(extraParams)},               
       reader: {rootProperty : rootProperty,
                  totalProperty: totalProperty
                 }
        },
 listeners:{
    load: 
      function(store, records, successful, eOpts){
        if (array_eventos.length > 0)
            { if (array_eventos[0].load)
                {FunctionLoadStore(id, store, records, successful, eOpts);}
            }
       },
    clear:
      function (store, eOpts){
        if (array_eventos.length > 0)
            { if (array_eventos[0].clear)
                {FunctionClearStore(id, store, eOpts);}
            }  
      },   
    beforeload:
      function(store, operation, eOpts){
        if (array_eventos.length > 0)
            { if (array_eventos[0].beforeload)
                {FunctionBeforeLoadStore(id, store, operation, eOpts);}
            }
       }      
  }        
}); 
  return store; 
}

function crear_objeto_store_2(model, id, data, array_eventos=[]){
var store  =  Ext.create ('Ext.data.Store',{
  model: model,
  storeId : id,
  data: data,
  listeners:{
     load: 
       function(store, records, successful, eOpts){
                    if (array_eventos.length > 0)
                        { if (array_eventos[0].load)
                            {FunctionLoadStore(id, store, records, successful, eOpts);}
                        }
      },
     beforeload:
      function(store, operation, eOpts){
        if (array_eventos.length > 0)
            { if (array_eventos[0].beforeload)
                {FunctionBeforeLoadStore(id, store, operation, eOpts);}
            }
       } 
    }        
}); 
  return store; 
}

//en el parametro groupField iria el index por el cual quiere agrupar
function crear_objeto_store_agrupado(model, id, groupField, auto = false, url = '', property ='', direction='ASC', array_eventos=[]){
var store = Ext.create('Ext.data.Store', {
     model: model,
     storeId : id,
     autoLoad: auto,
     sorters: [{
               property: property,
               direction: direction
              }],
     
     groupField: groupField, 
    
    proxy   :  {type: 'ajax',
                url: url,
                extraParams: {},
                reader: {}
               },
    
    listeners:{load: function (){}
              }
});
return store;
}


function removerAll_de_un_store(id_store){
    Ext.data.StoreManager.lookup(id_store).removeAll();
}

function removerAll_de_un_store_v2(store){
    store.removeAll();
}

function hacer_commit_a_una_grid(store){
store.commitChanges();    
}

function hacer_commit_a_una_grid_v2(id_store){
Ext.data.StoreManager.lookup(id_store).commitChanges();    
}

function traer_datos_a_guardar(id_store, all=false){
var array_datos = [];  
var registros;

if (!all)
   {registros = Ext.data.StoreManager.lookup(id_store).getModifiedRecords();}
else
   {registros = Ext.data.StoreManager.lookup(id_store).getRange();}
   
Ext.each(registros, function(record){
    array_datos.push(record.data);              
});
return  array_datos;    
}

function traer_datos_modificados_acorde_a_una_condicion_verdadera(store, index, index2=""){
var array_datos = [];
var registros = store.getModifiedRecords();
Ext.each(registros, function(record){
    if (record.get(index))
      {if(index2 === "")
          {array_datos.push(record.data);}
       else
          {array_datos.push(record.get(index2));}
      }
});
return  array_datos;
}


function traer_datos_a_guardar_v2(store, array_indices){
var array_datos =[];    
var registros = store.getModifiedRecords();

Ext.each(registros, function(record){
    var rec = {dato_1: "", dato_2: "", dato_3: ""}; 
    rec.dato_1 = record.get(array_indices[0]);
    rec.dato_2 = record.get(array_indices[1]);
    rec.dato_3 = record.get(array_indices[2]);
    
    array_datos.push(rec);
});

return  array_datos;    
}

function traer_datos_a_guardar_v3(id_store, aplicar_cambio_saltos_de_linea=false, index_a_cambiar=[]){
var array_datos = [];    
var registros = Ext.data.StoreManager.lookup(id_store).getRange();
Ext.each(registros, function(record){
    array_datos.push(record.data);              
});
if (!aplicar_cambio_saltos_de_linea)
    {return  array_datos;}
else
    {for (var i=0; i <array_datos.length; i++)
      {for (var j=0; j< index_a_cambiar.length; j++)
          {array_datos[i][j] = remplazar_substring_de_caracteres_de_escape (array_datos[i][j]);}
      }
      return array_datos;
    }     
}

function quitar_seleccion_en_grid(grid, id_grid=""){
 if (id_grid !== "")
   {Ext.getCmp(id_grid).getSelectionModel().deselectAll();}
 else
   {grid.getSelectionModel().deselectAll();}
   
}

function realizar_commit_a_store(store){
  store.commitChanges();    
}

function abrir_ventana(id_objeto){
var ventana_auxiliar = Ext.getCmp(id_objeto);
if (ventana_auxiliar)
    {ventana_auxiliar.show();}
else
   {if (Ext.getCmp(id_objeto))  
       {Ext.getCmp(id_objeto).show(); }
    else
      {alert('no existe id= '+id_objeto)}
   }        
}

function validar_objeto_en_blanco(id_objeto){
  if (Ext.getCmp(id_objeto).isValid())
     {return true;}
  else
     {return false;}
}

function crear_msg_alerta(titulo, msg){
  Ext.Msg.alert(titulo, '<center>'+msg+'</center>');     
}

function limpiar_varios_objetos(array_objetos){
  for (var i=0; i<array_objetos.length; i++){
      limpiar_objeto(array_objetos[i]);    
   }
}

function limpiar_objeto(id_objeto){
  Ext.getCmp(id_objeto).setValue();       
 }
  
function activar_deshabilitar_varios_objetos(array_objetos, valor){
  for (var i=0; i<array_objetos.length; i++){
      activar_deshabilitar_objeto(array_objetos[i], valor);    
   }       
}

function activar_deshabilitar_objeto(id_objeto, valor){
  Ext.getCmp(id_objeto).setDisabled(valor);       
 }
  
function cargar_store_objeto(url, id_store, parametros, error, timeout= 180000, fnCallback=false){  
   Ext.data.StoreManager.lookup(id_store).load({url: url,
                                                params:{parametros: Ext.JSON.encode(parametros)},
                                                failure: 
                                                  function(response, opts) 
                                                     {Ext.Msg.alert('Error...','<center>'+error+'</center>');},
                                                timeout:timeout,
                                                callback: 
                                                   function (records, operation, success) 
                                                      { if (fnCallback)
                                                            {fnCallback_Store(id_store, records, operation, success);}
                                                      },
                                                 scope: this     
                                               });  
 }
 
function cambiar_proxy_store (id_store,url='', parametros=[])  {
Ext.data.StoreManager.lookup(id_store).setProxy
         ({type: 'ajax',
           url: url,
           extraParams: {parametros: Ext.JSON.encode(parametros)},
           reader: {}
          });
}     

function buscar_numero_registros_modificados(id_store){
  return Ext.data.StoreManager.lookup(id_store).getModifiedRecords().length;
}


function mensaje_de_confirmacion(titulo, msg, ancho, alto, id,  yes='', no='', parametros=[]){
Ext.MessageBox.show
   ({title: titulo,
     msg: msg,
     width: ancho,
     height:alto,
     buttons: Ext.MessageBox.YESNO,
     icon: Ext.MessageBox.QUESTION,
     id: id,
     buttonText: {yes: yes,
                  no: no
                 },
     fn: function (btn)
       {if (btn === 'yes')
           { if (yes !== '' && yes !== null)
                    {FunctionYesConfirmacion(yes, id, parametros);}
               }
        else
               {
                if (no !== '' && no !== null)
                    {FunctionNoConfirmacion(no, id, parametros);}
               }
      }
    });
}



function crear_mascaras_de_proceso (msg="Procesando", idMask="", target= Ext.getBody(), operacion = 1){

if (Ext.getCmp(idMask))
    {mask_Show_Hide(idMask, operacion);}
else
   {var Mask_procesando = new Ext.LoadMask({
           msg: msg,
           id: idMask,
           target:target    
         });
    mask_Show_Hide(idMask, operacion);     
    }     

}

function mask_Show_Hide(idMask, oper= 1){
    if (oper === 1)
       {Ext.getCmp(idMask).show();}
    else
       {Ext.getCmp(idMask).destroy();}    
}

function msg_acorde_al_id_mask(id){
switch(id) {
    case 'id_Mask_procesando':
        return "Procesando... Espere Porfavor";
        
    default:
        return "Procesando... Espere Porfavor";
 }    
}

Ext.apply(Ext.form.field.VTypes,{
solo_numeros_y_letras: function (value){
   return /[0-9 A-Z a-z ñ Ñ]/.test(value)          
 },    
 solo_numeros_y_letrasText:'[0-9 A-Z a-z]',
 solo_numeros_y_letrasMask: /[0-9A-Za-zñÑ ]/    
});

Ext.apply(Ext.form.field.VTypes,{
solo_numeros: function (value){
   return /[0-9]/.test(value)          
 },    
 solo_numerosText:'[0-9]',
 solo_numerosMask: /[0-9]/    
});

Ext.apply(Ext.form.field.VTypes,{
solo_numeros_1_a_4: function (value){
   return /[1-4]/.test(value)          
 },    
 solo_numeros_1_a_4Text:'[1-4]',
 solo_numeros_1_a_4Mask: /[1-4]/    
});

Ext.apply(Ext.form.field.VTypes,{
solo_numeros_guion_letras_espacios: function (value){
   return /[0-9 A-Z a-z ñ Ñ -]/.test(value)          
 },    
 solo_numeros_guion_letras_espaciosText:'[0-9 A-Z a-z -]',
 solo_numeros_guion_letras_espaciosMask: /[0-9A-Za-z-ñÑ ]/    
});

Ext.apply(Ext.form.field.VTypes,{
solo_numeros_guion_letras_sin_espacios: function (value){
   return /[0-9 A-Z a-z ñ Ñ -]/.test(value)          
 },    
 solo_numeros_guion_letras_sin_espaciosText:'[0-9 A-Z a-z -]',
 solo_numeros_guion_letras_sin_espaciosMask: /[0-9A-Za-z-ñÑ]/    
});

Ext.apply(Ext.form.field.VTypes,{
solo_numeros_especios_guines: function (value){
   return /[0-9 -]/.test(value)          
 },    
 solo_numeros_especios_guinesText:'[0-9 -]',
 solo_numeros_especios_guinesMask: /[0-9- ]/    
});

function llamado_ext_ajax_request(url, parametros, msg_exito, msg_error_trycatch, msg_error_ajax, funcionSuccess="", 
                                  OtrosParametros='', id_mask="id_Mask_procesando", functionFailure="", timeout=200000, 
                                  method='POST', fnCallback="", target=Ext.getBody(), mostrar_mensaje_exito = false, 
                                  encode_parametros=true, enconde_OtrosParametros=true){
  
crear_mascaras_de_proceso (msg_acorde_al_id_mask(id_mask), id_mask, target, 1);   

if (encode_parametros)
  {var parametros_encode = Ext.JSON.encode(parametros);}
else
  {var parametros_encode = parametros;}  

if (enconde_OtrosParametros)
  {var OtrosParametros_encode = Ext.JSON.encode(OtrosParametros);}
else
  {var OtrosParametros_encode = OtrosParametros;}  


    
Ext.Ajax.request({
   url: url,
   params: {parametros:  parametros_encode,
            parametros2: OtrosParametros_encode
           },
   success: function (response, opts)
    {var isSuccess = true;
     var resp = "";
     mask_Show_Hide(id_mask, 0);                     
     try
        {resp = Ext.JSON.decode(response.responseText);} 
     catch (error)
       {if (msg_error_trycatch !== "" && msg_error_trycatch !== null)
           {crear_msg_alerta('ALERTA', msg_error_trycatch+"<br>"+error);}
            isSuccess = false;
       }

       if (isSuccess) {
            if (funcionSuccess !== "" && funcionSuccess !== null)
               {FunctionSuccess(resp, funcionSuccess, parametros, OtrosParametros);} // esta funcion se tiene que implementar en cada modulo acorde a las necesidades
                               
            if (msg_exito !== '' && msg_exito !== null && mostrar_mensaje_exito)
               {crear_msg_alerta("Éxito", msg_exito);}
        } 
    },
   failure: function (response, opts) {
         mask_Show_Hide(id_mask, 0);
         if (msg_error_ajax !== "" && msg_error_ajax !== null)
            {crear_msg_alerta("Error", msg_error_ajax);}
                             
         if (functionFailure !== "" && functionFailure !== null)
             {FunctionFailure(response, functionFailure, parametros, OtrosParametros);}
                            
   },
  timeout:timeout,
  method: method,
  callback: function (response, opt){
      if (fnCallback !== "")
         {}
  }
});       
}

//ejemplo de la funcion FunctionSuccess o functionFailure
/*
function FunctionSuccess(response, funcionSuccess, parametros, ArrayOtrosParametros){
  switch(funcionSuccess) {
    case 1:
        break;
        
    case 2:
         break;
    
    case 3:
         break;
   }    
}*/


function resaltar_fila_seleccionada(e, operacion = "add", activo = "on"){
if (activo === "on"){
   if (operacion === "add")   
       {e.row.classList.add('fila_seleccionada');}
    
   if (operacion === "remove")   
      {e.row.classList.remove('fila_seleccionada');}
 
   var children = e.row.children;
   var i;
   for (i = 0; i < children.length; i++) {
       if (operacion === "add")   
          {children[i].classList.add('celda_en_fila_seleccionada');}
    
      if (operacion === "remove")   
         {children[i].classList.remove('celda_en_fila_seleccionada');}
   }    
 }
}


function crear_boton_con_icono(id, margin, iconCls, text_html, hidden=false, disabled=false, tooltip="", class_html= "bigBtn", ancho=100, 
                              alto=100, array_eventos=[]){
   
var boton =  Ext.create('Ext.Button',{
id: id,
margin: margin,
width: ancho,
height: alto,
iconCls: iconCls,
iconAlign:'top',
html:'<span class="'+class_html+'">'+text_html+'</span>',
tooltip: tooltip,
tooltipType : 'title',
hidden: hidden,
disabled: disabled,
listeners:
          {click: function()
                  {if (array_eventos.length > 0 ) 
                      {if (array_eventos[0].click)
                          {functionClickBoton(id);} 
                      }
                  }
          }
});    

return boton;
} ;   


function crear_boton(text, id, margin, hidden=false, disabled=false, tooltip="", ancho=100, alto=30, array_eventos=[], cls='', 
                     scale= 'small', icon=null, iconCls='', iconAlign='left', index=""){
   
var boton =   Ext.create('Ext.Button',{
id: id,
text: text,
margin: margin,
width: ancho,
height: alto,
tooltip: tooltip,
tooltipType : 'title',
hidden: hidden,
cls:cls,
scale:scale,
disabled: disabled,
icon: icon,
iconCls: iconCls,
iconAlign: iconAlign,
listeners:
           {click: function()
                  {if (array_eventos.length > 0 )
                      {if (array_eventos[0].click)
                          {functionClickBoton(id, index);} 
                      }
                  }
           }
});    
return boton;
}  


function crear_text_field(fieldLabel, id, labelWidth, width, margin='0 0 0 0', value= "", hidden=false, disabled=false, allowBlank=true, readOnly=false, vtype="", 
                          inputAttrTpl="center", labelAlign="left", labelPad=10, maxLength=100, minLength=3, enableKeyEvents=false, enforceMaxLength=true, tooltip="", 
                          array_eventos=[], labelSeparator=':', inputType='text', emptyText=''){
 //labelAlign = "left" (the default),  "top" , "right"
                             
 var textfield =  Ext.create('Ext.form.field.Text',{
      fieldLabel: '<b>'+fieldLabel+'</b>',
       id: id,
       name: pasar_a_minuscula('name_'+id),
       labelWidth: labelWidth,
       width: width,
       flex: 0,
       allowBlank: allowBlank,
       margin: margin,
       readOnly: readOnly,
       emptyText: emptyText,
       vtype: vtype,
       labelAlign: labelAlign,
       maxLength:maxLength,
       minLength:minLength,
       hidden: hidden,

       disabled: disabled,  
       inputAttrTpl: 'style="text-align: '+inputAttrTpl+';"',
       labelPad: labelPad,
       value:value,
       inputType:inputType,
       labelSeparator:labelSeparator,
       enforceMaxLength:enforceMaxLength,
       enableKeyEvents: enableKeyEvents,
       tooltip: tooltip,
       listeners: {
            keydown: 
              function (text, e, eOpts) {
                if (array_eventos.length > 0){
                   if (array_eventos[0].keydown){
                      functionKeyDown(id, text, e, eOpts);
                   }
                }   
              },
             keyup: 
              function (text, e, eOpts) {
                if (array_eventos.length > 0){
                   if (array_eventos[0].keyup){
                      functionKeyUp(id, text, e, eOpts);
                   }
                }   
              },   
             render : 
              function(c) {
                if (array_eventos.length > 0){
                  if (array_eventos[0].render){ 
                      Ext.create('Ext.tip.ToolTip', {
                      target: c.getEl(),
                       html: c.tooltip
                       });
                  }   
                }
              }  
            }
 });   
  return textfield  ;    
}


function crear_number_field(fieldLabel, id, labelWidth, width, margin='0 0 0 0', value, hidden=false, disabled=false, allowBlank=true, readOnly=false, 
                            vtype="", inputAttrTpl='', labelAlign="left", labelPad=15, maxLength=1, keyNavEnabled=false, 
                            minValue, maxValue, decimalPrecision=1, decimalSeparator='.', hideTrigger=false, tooltip= "", enableKeyEvents=false, 
                            array_eventos=[], labelSeparator=''){
                                
var number_field =  Ext.create('Ext.form.field.Number',{ 
 fieldLabel:'<b>'+fieldLabel+'</b>',
 id: id, 
 labelSeparator:labelSeparator,
 name: pasar_a_minuscula('name_'+id),
 labelWidth: labelWidth,
 width : width,
 margin: margin,
 enableKeyEvents:enableKeyEvents,
 value:value, 
 hidden:hidden,
 disabled:disabled,
 allowBlank:allowBlank,
 readOnly:readOnly,
 vtype:vtype,
 labelAlign:labelAlign,
 labelPad: labelPad,
 maxLength:maxLength,
 keyNavEnabled:keyNavEnabled,
 inputAttrTpl: 'style="text-align: '+inputAttrTpl+';"',
 minValue:minValue,
 maxValue: maxValue,
 decimalPrecision: decimalPrecision,
 decimalSeparator :decimalSeparator,
 hideTrigger : hideTrigger,
 tooltip: tooltip,
 listeners: {
            keydown: 
                function (text, e, eOpts) {
                        if (array_eventos.length > 0){
                             if (array_eventos[0].keydown){
                              functionKeyDown(id, text, e, eOpts);
                             }
                        }   
                    },
            render : 
                function(c) {
                  if (array_eventos.length > 0){
                  if (array_eventos[0].render){ 
                      Ext.create('Ext.tip.ToolTip', {
                      target: c.getEl(),
                       html: c.tooltip
                       });
                  }   
                }
                }, 
            keyup:
              function (text, e, eOpts) {
                        if (array_eventos.length > 0){
                             if (array_eventos[0].keyup){
                              functionKeyUp(id, text, e, eOpts);
                             }
                        }   
                    }
            
            }
}); 
return  number_field;   
}

function crear_calendario(fieldLabel, id, labelWidth, width, margin, value="", hidden=false, disabled=false, editable=false, readOnly = false, labelAlign="left", 
                          labelPad=10, maxValue="", minValue="", format='Y-m-d', allowBlank=true, disabledDays=[], tooltip="",inputAttrTpl= 'center', 
                          array_eventos=[], enableKeyEvents =false){
var calendario =  Ext.create('Ext.form.field.Date',{
        fieldLabel: '<b>'+fieldLabel+'</b>',
        id: id,
        name: pasar_a_minuscula('name_'+id),
        labelWidth: labelWidth,
        width: width,
        margin: margin,
        editable: editable,
        tooltip:tooltip,
        enableKeyEvents:enableKeyEvents,
        labelAlign: labelAlign,
        labelPad: labelPad,
        maxValue: maxValue,
        minValue: minValue,
        format: format,
        allowBlank: allowBlank,
        disabledDays: disabledDays,
        readOnly: readOnly,
        hidden: hidden,
        disabled: disabled,
        value:value,
        inputAttrTpl: 'style="text-align: '+inputAttrTpl+';"',
        listeners:{
            render : 
              function(c) {
                if (array_eventos.length > 0){
                  if (array_eventos[0].render){ 
                      Ext.create('Ext.tip.ToolTip', {
                      target: c.getEl(),
                       html: c.tooltip
                       });
                  }   
                 }
               },  
            keydown:
               function (c, e, eOpts)
                  {if (array_eventos.length > 0){
                  if (array_eventos[0].keydown){ 
                      {functionKeyDown(id, c, e, eOpts);}
                  }   
                 }
              }
        }
        
    });

return calendario;
}

function crear_combobox(fieldLabel, labelWidth, width, displayField, valueField, id, store, margin, allowBlank=true, editable=false, forceSelection= true, 
                        hidden=false, disabled=false, queryMode = 'local', typeAhead=false, triggerAction = 'all', hideTrigger= false, readOnly=false, 
                        labelAlign="left", labelPad=10, cls='', loadingText= 'Buscando...', emptyText = '¡No se encontraron registros!', cls_listConfig='', 
                        getInnerTpl='<center>{displayField}</center>', tooltip="", inputAttrTpl='center', tpl = "", enableKeyEvents=false, array_eventos=[], 
                        displayTpl='', labelSeparator=':'){
/*ejemplo de un tpl
 * tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item">{nombre_programa_academico}</div>',
                '</tpl>'
             )
    
  tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{abbr} - {name}</li>',
        '</tpl></ul>'
    ),
    // template for the content inside text field
  displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
        '{abbr} - {name}',
        '</tpl>'
    )  
 */                            
    
var combo =  Ext.create ('Ext.form.field.ComboBox',{ 
    fieldLabel: '<b>'+fieldLabel+'</b>',
    labelWidth: labelWidth,
    labelSeparator:labelSeparator,
    labelPad: labelPad,
    width: width,
    tpl:tpl,
    displayTpl:displayTpl,
    inputAttrTpl: 'style="text-align: '+inputAttrTpl+';"',
    enableKeyEvents:enableKeyEvents,
    labelAlign: labelAlign,
    displayField: displayField,
    valueField  : valueField,
    id: id,
    flex: 0,
    tooltip:tooltip,
    name: pasar_a_minuscula('name_'+id),  
    store: store,
    margin: margin,
    hidden: hidden,
    hideTrigger:hideTrigger,
    disabled: disabled,   
    queryMode: queryMode,  
    typeAhead: typeAhead,
    triggerAction: triggerAction,
    forceSelection: forceSelection,
    editable : editable,
    allowBlank: allowBlank, 
    readOnly: readOnly,
    cls: cls,
    listConfig: {loadingText: loadingText,
                 emptyText:emptyText ,
                 cls: cls_listConfig,
                 getInnerTpl: function() {
                              return getInnerTpl; //ejemplo de un return '<span<tpl if="es_tecnica"> class="blue"</tpl>>{nombre_asignatura}</span>'
                        }
                },
    listeners: {
        select: 
         function (combo, records, eOpts){
          if  (array_eventos.length > 0){
            if (array_eventos[0].select) {
               if (records[0] !== null && records[0] !== '')
                  {functionComboBoxSelect(id, combo, records, eOpts);}
            } 
          }
         },
        change:
            function ( combo, newValue, oldValue, eOpts )
              {if (array_eventos.length > 0){
                  if (array_eventos[0].change)
                     {functionComboBoxChange(id, combo, newValue, oldValue, eOpts);}
               } 
              },
        render : 
          function(c) {
            if (array_eventos.length > 0){
              if (array_eventos[0].render){ 
                 Ext.create('Ext.tip.ToolTip', {
                   target: c.getEl(),
                   html: c.tooltip
                 });
              }   
            }
           },
        keydown: 
          function (combo, e, eOpts) {
            if (array_eventos.length > 0){
               if (array_eventos[0].keydown){
                  functionKeyDownComboBox(id, combo, e, eOpts);
               }
            }   
          }   
    }                                                              
});
return combo;
}
 
               

function crear_check_con_tooltip(fieldLabel, id, margin, labelWidth, tip= "", hidden=false, disabled=false, labelAlign = 'left', checked =false, 
                                 array_eventos=[], readOnly= false){

var check =  Ext.create('Ext.form.field.Checkbox',{
 id: id,
 margin: margin,
 labelWidth: labelWidth,
 hidden: hidden,
 disabled: disabled,
 labelAlign: labelAlign,
 checked : checked,
 fieldLabel: '<b>'+fieldLabel+'</b>', 
 tip: tip,
 readOnly:readOnly,
 listeners:{ render : function(c) {
                         Ext.create('Ext.tip.ToolTip', {
                         target: c.getEl(),
                         html: c.tip 
                        });
                    },
             change:
               function (check, newValue, oldValue, eOpts){
                  if (array_eventos.length > 0 )
                      {if (array_eventos[0].change)
                          {FunctionCheckBoxChange(id, check, newValue, oldValue, eOpts);} 
                      }   
                }       
           }
});
return check;
}


function crear_panel(titulo, id, width, height, margin='0 0 0 0', layout_type="hbox",  items=[], bodyStyle ="", border=false, autoScroll=false, hidden=false, 
                     disabled=false, html="", region="", collapsed=false, collapsible=false, titleAlign="right", array_eventos=[],
                     layout_align=null, layout_pack=null){
 //tipos de region:   'north', 'center', 'south', 'east',  'west'  
var panel =  Ext.create('Ext.panel.Panel', {
    title: titulo,
    id: id,
    bodyStyle: 'background: '+bodyStyle,
    width:  width,
    height: height,
    border: border,
    margin: margin,
    disabled:disabled,
    hidden: hidden,
    layout:{type: layout_type,
            aling: layout_align,
            pack: layout_pack
           },
    autoScroll: autoScroll,
    region: region,
    items: items,
  
    collapsible: collapsible,
    collapsed: collapsed,
    html: html,
    titleAlign:titleAlign,
    listeners:
           {activate: function(pnl, eOpts )
                  {if (array_eventos.length > 0 )
                      {if (array_eventos[0].activate)
                          {FunctionActivatePanel(id, pnl, eOpts);} 
                      }
                  }
           }
});
return panel;
}
  


function crear_panel_con_fondo(titulo, id, width, height, margin='0 0 0 0', layout="hbox",  items=[], url_imagen_bodyStyle ="", border=false, 
                               autoScroll=false, hidden=false, html="", region="", collapsed=false, collapsible=false, titleAlign="right", array_eventos=[]){
 //tipos de region:   'north', 'center', 'south', 'east',  'west'  
var panel =  Ext.create('Ext.panel.Panel', {
    title: titulo,
    id: id,
    bodyStyle: 'background-image: url('+url_imagen_bodyStyle+')!important; background-repeat: no-repeat;',
    width:  width,
    height: height,
    border: border,
    margin: margin,
    layout: layout,
    hidden: hidden,
    autoScroll: autoScroll,
    region: region,
    items: items,
    collapsible: collapsible,
    collapsed: collapsed,
    html: html,
    titleAlign:titleAlign
});
return panel;
}
  

function crear_container_viewport(id, items=[], bodyStyle= "", layout="border", hidden=false, disabled=false, array_eventos=[]){
var ContainerViewport =  Ext.create('Ext.container.Viewport',{
    id: id,
    layout: layout,
    bodyStyle: 'background:'+bodyStyle,
    items:items,
    hidden:hidden,
    disabled:disabled
});
return ContainerViewport;
}


function crear_window(title, id, height, width, layout='vbox', hidden=false, resizable=false, closable=true, 
                      background='#FFFFFF', items=[], array_eventos=[], autoScroll=false, titleAlign="right"){
var ventana =  Ext.create('Ext.window.Window',{ 
id    : id,   
title : title, 
height: height,
width : width,
autoShow: false,
hidden:hidden,
closeAction: 'hide',
closable: closable,
layout: layout,
resizable : resizable,
items:items,
autoScroll: autoScroll,
bodyStyle: 'background:'+background,
titleAlign: titleAlign,
listeners:{
           show:
             function(){
                 if (array_eventos.length > 0){
                     if (array_eventos[0].show)
                        {functionShowWindow(id);}
                 }
              },
           close: 
             function(){
                 if (array_eventos.length > 0){
                     if (array_eventos[0].close)
                        {functionCloseWindow(id);}
                 }
              }
          }
});
return ventana;
}


function crear_nuevo_record_en_una_grid(store, record){

var registro = store.getRange();
var cantidad = registro.length;

if (cantidad > 0)
   {store.insert((cantidad+1), record);}
else
   {store.insert(0, record);} 
               
}

function crear_nuevo_record_en_una_grid_v2(model, store, plugin_grid){
var r = Ext.ModelManager.create({}, model); 
store.insert(0, r);
//plugin_grid.startEditByPosition({row: 0, column: 0});                 
}


function remove_record_store(store, rec){
    store.remove(rec);
}

function navegar_con_las_flechas_y_ENTER_dentro_de_una_tabla_v1(e, grid, plugin_editor_grid){
 var object = grid.getSelectionModel().getCurrentPosition();
 
 if(typeof grid.normalGrid !== 'undefined') 
   {plugin_editor_grid = grid.normalGrid.plugins[0];}
   
 switch (e.getKey()) {
       // Flecha izquierdad
        case 37:
                object.column = object.column - 1;
                plugin_editor_grid.startEditByPosition(object);
                break;
       
        // Flecha arriba
        case 38:
                object.row = object.row - 1;
                plugin_editor_grid.startEditByPosition(object);
                break;
        
        // Flecha derecha
        case 39:
                object.column = object.column + 1;
                plugin_editor_grid.startEditByPosition(object);
                break;
            
        // Tecla ENTER
        // Flecha abajo
        case Ext.EventObject.ENTER:
        case 40:
                object.row = object.row + 1;
                plugin_editor_grid.startEditByPosition(object);
                break;
  }   
}


function desplazamiento_dentro_de_una_grid_6_5 (e, grid, plugin_editor){
var object = grid.getSelectionModel().getPosition();
var registros = grid.getStore().getRange();
var total_row = registros.length;

switch (e.getKey()) { 
    // Flecha arriba
    case 37:        
      object.colIdx = object.colIdx - 1;
      break;
 
 
    // Flecha izquierda
    case 38:
      object.rowIdx = object.rowIdx - 1;
      break;
    
    
    // Flecha derecha
    case 39:
      object.colIdx = object.colIdx + 1;
      break;
 
        
    // Tecla ENTER
    // Flecha abajo
    case Ext.EventObject.ENTER:
    case 40:
        object.rowIdx = object.rowIdx + 1;        
       break;
   }
   
   if (object.rowIdx > total_row )
      {object.rowIdx = 0;}
      
  grid.getSelectionModel().setPosition({row:object.rowIdx, column:object.colIdx});
  plugin_editor.startEditByPosition({row:object.rowIdx, column:object.colIdx}); 
}    



function desplazamiento_hacia_lados_con_flechas(grid, colInd, desplazamiento, limite, tipo_grid){
    
if (desplazamiento === "-")
  {for (var i=colInd; i>=limite; i--)
     {var disabledColumn = retornar_arreglo_de_encabezados_grid_o_valor_de_una_propiedad_encabezado(grid, i, tipo_grid, "disabled");
      var editorColumn = retornar_arreglo_de_encabezados_grid_o_valor_de_una_propiedad_encabezado(grid, i, tipo_grid, "editor");
      var id =  retornar_arreglo_de_encabezados_grid_o_valor_de_una_propiedad_encabezado(grid, i, tipo_grid, "id");
      if (editorColumn !== "" && !disabledColumn && Ext.getCmp(id).isVisible())
        { return i;}
     }
   return colInd;
  }
else if (desplazamiento === "+")
  { for (var i=colInd; i<=limite; i++)
     {var disabledColumn = retornar_arreglo_de_encabezados_grid_o_valor_de_una_propiedad_encabezado(grid, i, tipo_grid, "disabled");
      var editorColumn = retornar_arreglo_de_encabezados_grid_o_valor_de_una_propiedad_encabezado(grid, i, tipo_grid, "editor");
      var id =  retornar_arreglo_de_encabezados_grid_o_valor_de_una_propiedad_encabezado(grid, i, tipo_grid, "id");
      if (editorColumn !== "" && !disabledColumn && Ext.getCmp(id).isVisible())
          {return i;}  
     }
    return colInd;
  }     
}

function navegar_con_las_flechas_y_ENTER_dentro_de_una_tabla_v2(e, grid, plugin_editor_grid, min, max, tipo_grid="both"){
    // los tipo_grid son 'both' 'normal'  'locked'
 var object = grid.getSelectionModel().getCurrentPosition();
 var column_min = 0;
 var column_max =  grid.getStore().getTotalCount() - 1;
 
 if(tipo_grid !== 'both' && typeof grid.normalGrid !== 'undefined') 
    {plugin_editor_grid = grid.normalGrid.plugins[0];}
 
 switch (e.getKey()) {
       // Flecha izquierda
        case 37:
                var columna_actual = object.column - 1;
                object.column = desplazamiento_hacia_lados_con_flechas(grid, columna_actual, "-", min, tipo_grid);
                if (object.column < min)
                       {object.column = max;
                        object.row = object.row - 1;   
                       }
                   
                plugin_editor_grid.startEditByPosition(object); 
                break;
      

         // Flecha arriba
        case 38:
                object.row = object.row - 1;
                if (object.row < column_min)
                   {object.row = column_max;}
                plugin_editor_grid.startEditByPosition(object);
                break;
        
        // Flecha derecha
        case 39:
                var columna_actual = object.column + 1;
                object.column = desplazamiento_hacia_lados_con_flechas(grid, columna_actual, "+", max, tipo_grid); 
                    if (object.column > max)
                       {object.column = min;
                        object.row = object.row +1;   
                        plugin_editor_grid.startEditByPosition(object);
                       }
               plugin_editor_grid.startEditByPosition(object);
               break;
                
        // Tecla ENTER
        // Flecha abajo
        case Ext.EventObject.ENTER:
        case 40:
                object.row = object.row + 1;
                 if (object.row > column_max)
                   {object.row = column_min;}
                plugin_editor_grid.startEditByPosition(object);
                break;
  }   
}

function retornar_arreglo_de_encabezados_grid_o_valor_de_una_propiedad_encabezado(grid, colIndex="", TipoGrid='both', propiedad="", id_grid=""){
 var header;
 if (id_grid !== "")
    {grid = Ext.getCmp(id_grid);}
 
 if (TipoGrid === 'both')
    {header = grid.headerCt.getGridColumns();}
 else if (TipoGrid === 'normal' &&  typeof grid.normalGrid !== 'undefined')
             {header = grid.normalGrid.headerCt.getGridColumns();}
      else if (TipoGrid === 'locked' &&  typeof grid.lockedGrid !== 'undefined')       
               {header = grid.lockedGrid.headerCt.getGridColumns();} 
           else
               {header = grid.headerCt.getGridColumns();}

if (colIndex !== "")
  { if (propiedad !== "")
      {return header[colIndex][propiedad];}
    else
      {return header[colIndex];} 
  }
else
 {return header;}  
    
}

function crear_plugin_para_grid(pluginId='', listeners =[], clicksToEdit=2){
var plugin =  Ext.create('Ext.grid.plugin.CellEditing', {
clicksToEdit: clicksToEdit,
pluginId: pluginId,
listeners:{
  beforeedit: 
    function(editor, e, eOpts)
     {if (listeners.length > 0 )
        {if (listeners[0].beforeedit)
          {FunctionPluginBeforeEdit(pluginId, editor, e, eOpts);} 
        }
     },            
  validateedit: 
    function(editor, e, eOpts)
     {if (listeners.length > 0 )
       {if (listeners[0].validateedit)
          {FunctionPluginValidateEdit(pluginId, editor, e, eOpts);} 
       }
     },
   edit: 
    function(editor, e,eOpts)
     {if (listeners.length > 0 )
        {if (listeners[0].edit)
           {FunctionPluginEdit(pluginId, editor, e, eOpts);} 
        }
    },
   canceledit:
    function(editor, e, eOpts)
      {if (listeners.length > 0 )
        {if (listeners[0].canceledit)
            {FunctionPluginCancelEdit(pluginId, editor, e, eOpts);} 
        }
      }       
  }
});
return plugin;
}

function crear_paginador_grid(store){
 var paginador =  Ext.create('Ext.toolbar.Paging',{
        store: store,
        displayInfo: true,
        displayMsg: '{0} - {1} de {2} Resultados',
        emptyMsg: 'No Se encontraron Resultados'

    });
return paginador;
}

function crear_gridpanel(id, width, height, margin, columns, store, hidden=false,  autoScroll=true, plugins=[], selType= 'cellmodel',hideHeaders=false, 
                         enableColumnHide=false, features=[], array_eventos=[], hideGroupedHeader=true, enableGroupingMenu= false, title='',
                         function_getRowClass=false){

//para agrupar colocar el parametro ftype='grouping' o 'groupingsummary'
//groupHeaderTpl: '<div style="float:left;" ><br>Tipo Calificación: {[values.children[0].get("nombre_forma_calificacion")]}<br></div> '
var grid;

if (features.length === 0){
  grid =  Ext.create('Ext.grid.Panel',{
      columnLines: true,
      width: width,
      height: height,  
      hideHeaders: hideHeaders,
      enableColumnHide:enableColumnHide,
      id: id,
      autoScroll: autoScroll, 
      margin: margin,
      columns: columns,
      hidden: hidden,
      title: title,
      plugins: plugins,
      selType: selType,
      store: store,
      viewConfig: {stripeRows: true,
                  enableTextSelection: true,
                  forceFit: true,
                  getRowClass : 
                    function (record, rowindex, rowParams, store) 
                         {if (function_getRowClass)
                             {return Function_GridGetRowClass(id, record, rowindex, rowParams, store);}    
                         }
                 }, 
      listeners: 
         {cellclick:
           function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts )
             {if (array_eventos.length > 0)
                 {if (array_eventos[0].cellclick)
                     {FunctionGridCellClick(id, grid, td, cellIndex, record, tr, rowIndex, e, eOpts);}
                 }       
             },
          celldblclick:
            function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts )
             {if (array_eventos.length > 0)
                 {if (array_eventos[0].celldblclick)
                     {FunctionGridCellDblclick(id, grid, td, cellIndex, record, tr, rowIndex, e, eOpts);}
                 }     
             },
          cellkeydown:
              function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts)
              {if (array_eventos.length > 0)
                 {if (array_eventos[0].cellkeydown)
                     {FunctionGridCellKeyDown(id, grid, td, cellIndex, record, tr, rowIndex, e, eOpts);}
                 }      
              },
          viewready:
              function (grid, eOpts)
               {if (array_eventos.length > 0)
                 {if (array_eventos[0].viewready)
                     {FunctionGridViewReady(id, grid, eOpts);}
                 }
               }, 
          headerclick:
              function (ct, column, e, t, eOpts)
               {if (array_eventos.length > 0)
                 {if (array_eventos[0].headerclick)
                     {FunctionGridHeaderClick(id, ct, column, e, t, eOpts);}
                 }
               }    
         }                 
           
     });  
 }
 
else{
  grid =  Ext.create('Ext.grid.Panel',{
      columnLines: true,
      width: width,
      height: height,  
      hideHeaders: hideHeaders,
      hideGroupedHeader:hideGroupedHeader,
      enableColumnHide:enableColumnHide,
      enableGroupingMenu:enableGroupingMenu,
      id: id,
      title: title,
      autoScroll: autoScroll, 
      margin: margin,
      columns: columns,
      hidden: hidden,
      plugins: plugins,
      selType: selType,
      store: store,
      features: [{
            ftype: features.ftype,
            groupHeaderTpl: features.groupHeaderTpl,
            hideGroupedHeader: true,
            startCollapsed: features.startCollapsed,
            collapsible: true
            }],
        
     viewConfig: {stripeRows: true,
                  enableTextSelection: true,
                  forceFit: true,
                  getRowClass : 
                    function (record, rowindex, rowParams, store) 
                        {if (function_getRowClass)
                            {return Function_GetRowClass(id, record, rowindex, rowParams, store);} 
                        }
                 }, 
     listeners: 
        {cellclick:
           function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts )
             {if (array_eventos.length > 0)
                 {   if (array_eventos[0].cellclick)
                     {FunctionGridCellClick(id, grid, td, cellIndex, record, tr, rowIndex, e, eOpts);}
                 }    
             },
         celldblclick:
            function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts )
             {if (array_eventos.length > 0)
                 {if (array_eventos[0].celldblclick)
                     {FunctionGridCellDblclick(id, grid, td, cellIndex, record, tr, rowIndex, e, eOpts);}
                 }     
             }, 
         cellkeydown:
              function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts)
              {if (array_eventos.length > 0)
                 {if (array_eventos[0].cellkeydown)
                     {FunctionGridCellKeyDown(id, grid, td, cellIndex, record, tr, rowIndex, e, eOpts);}
                 }      
              },
         viewready:
              function (grid, eOpts)
               {if (array_eventos.length > 0)
                 {if (array_eventos[0].viewready)
                     {FunctionGridViewReady(id, grid, eOpts);}
                 }
               }, 
         headerclick:
              function (ct, column, e, t, eOpts)
               {if (array_eventos.length > 0)
                 {if (array_eventos[0].headerclick)
                     {FunctionGridHeaderClick(id, ct, column, e, t, eOpts);}
                 }
               } 
        }                 
           
     });  
} 

return grid;
}


function crear_columna(id, text, width, dataIndex, editor="", draggable=false, hidden=false, xtype= "templatecolumn", 
                       tpl= '<div style="text-align:center;">{dataIndex}</div>',sortable=false, resizable=false, tooltip="", tooltipType='qtip' ,
                       renderer="", tdCls="", style= "", menuDisabled=false, disabled=false, align='center', locked=false, cls='', array_eventos=[], 
                       baseCls = Ext.baseCSSPrefix + 'column-header', summary=[]){

 //tipos de  summerType =     'count' = contar ;    'sum' =sumar     'min' = minimo valor   'max' = maximo valor   'average' = promedio
 //summaryRenderer  =  function(value, summaryData, dataIndex){}
var summaryType = "";
if (summary.length > 0)     
    {if (summary[0].summaryType !== "" && summary[0].summaryType != null) 
      {switch(summary[0].summaryType) {
           case 'count':
                summaryType = 'count';
                break;
           case 'sum':
                summaryType = 'sum';
                break;
           case 'min':
                summaryType = 'min';
                break;
           case 'max':
                summaryType = 'max';
                break;
           case 'average':
                summaryType = 'average';
                break;
         }
      }
}; 
    
    
 var columna = {id: id,  
                text: '<center>'+text+'</center>',
                align:align,
                width: width,
                dataIndex: dataIndex,
                draggable: draggable,
                hidden: hidden, 
                xtype: xtype, 
                tpl:tpl, 
                baseCls:baseCls,
                sortable :sortable, 
                resizable: resizable, 
                tooltip:tooltip, 
                tooltipType:tooltipType,
                editor: editor,  
                renderer: renderer,
                tdCls:tdCls,
                style:style,
                menuDisabled:menuDisabled,
                disabled: disabled,
                locked:locked,
                cls:cls,
                summaryType: summaryType,
                summaryRenderer: 
                  function (value, summaryData, dataIndex){
                    if (summary.length > 0)     
                      {if (summary[0].summaryRenderer) 
                         {return FunctionSummaryRenderer(id, value, summaryData, dataIndex);}
                      }
                    else
                      {return "";}
                 },
                           
                listeners:{
                  afterrender:
                    function ( c, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].afterrender)
                            {FunctionAfterRenderColumn(id, c, eOpts);} 
                      },
                  beforerender:
                    function ( c, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].beforerender)
                            {FunctionBeforeRenderColumn(id, c, eOpts);} 
                      },    
                 headertriggerclick:
                    function ( ct, column, e, t, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].headertriggerclick)
                            {FunctionHeaderTriggerClickColumn(id, ct, column, e, t, eOpts);} 
                      },   
                 headerclick:
                    function ( ct, column, e, t, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].headerclick)
                            {FunctionHeaderClickColumn(id, ct, column, e, t, eOpts);} 
                      }  
              }
 
    }  ; 
return columna;  
}


function crear_columna_rownumberer(id, text, width, draggable=false, hidden=false, sortable=false, resizable=false, tdCls="", style= "", 
                                   menuDisabled=false, disabled=false, align='center', locked=false, cls='', array_eventos=[], 
                                   baseCls = Ext.baseCSSPrefix + 'column-header', summary=[]){
//tipos de  summerType =     'count' = contar ;    'sum' =sumar     'min' = minimo valor   'max' = maximo valor   'average' = promedio
//summaryRenderer  =  function(value, summaryData, dataIndex){}
var summaryType = "";
if (summary.length > 0)     
    {if (summary[0].summaryType !== "" && summary[0].summaryType != null) 
      {switch(summary[0].summaryType) {
           case 'count':
                summaryType = 'count';
                break;
           case 'sum':
                summaryType = 'sum';
                break;
           case 'min':
                summaryType = 'min';
                break;
           case 'max':
                summaryType = 'max';
                break;
           case 'average':
                summaryType = 'average';
                break;
         }
      }
}; 
        
 var columna = {id: id,  
                text: '<center>'+text+'</center>',
                align:align,
                width: width,
                baseCls:baseCls,
                draggable: draggable,
                hidden: hidden, 
                xtype: 'rownumberer', 
                sortable :sortable, 
                resizable: resizable, 
                tdCls:tdCls,
                style:style,
                disabled:disabled,
                locked:locked,
                cls:cls,
                summaryType: summaryType,
                summaryRenderer: 
                  function (value, summaryData, dataIndex){
                    if (summary.length > 0)     
                      {if (summary[0].summaryRenderer) 
                         {return FunctionSummaryRenderer(id, value, summaryData, dataIndex);}
                      }
                    else
                      {return "";}
                 },
                listeners:{
                  afterrender:
                    function ( c, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].afterrender)
                            {FunctionAfterRenderColumn(id, c, eOpts);} 
                      },
                  beforerender:
                    function ( c, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].beforerender)
                            {FunctionBeforeRenderColumn(id, c, eOpts);} 
                      },    
                 headertriggerclick:
                    function ( ct, column, e, t, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].headertriggerclick)
                            {FunctionHeaderTriggerClickColumn(id, ct, column, e, t, eOpts);} 
                      },   
                 headerclick:
                    function ( ct, column, e, t, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].headerclick)
                            {FunctionHeaderClickColumn(id, ct, column, e, t, eOpts);} 
                      }  
              }
 
              };  
return columna;  
}

 function crear_columna_checkcolumn(id, dataIndex, text, width, draggable=false, hidden=false, sortable=false, resizable=false, tdCls="", style= "", 
                                   menuDisabled=false, disabled=false, align='center', locked=false, tooltip="", tooltipType='qtip', cls='', 
                                   array_eventos=[], baseCls = Ext.baseCSSPrefix + 'column-header'){
 
var columna ={id: id,
             text: '<center>'+text+'</center>',
             baseCls:baseCls,
             width: width,
             draggable: draggable,
             hidden: hidden,
             sortable:sortable,
             resizable:resizable,
             tdCls: tdCls,
             style: style,
             menuDisabled: menuDisabled,
             disabled: disabled,
             locked: locked,
             align: align,
             dataIndex: dataIndex,
             xtype: 'checkcolumn',
             tooltip:tooltip, 
             tooltipType:tooltipType,
             cls:cls,
             listeners:{
                checkchange:
                    function(CheckColumn, rowIndex, checked, eOpts){
                      if (array_eventos.length > 0){
                         if (array_eventos[0].checkchange)
                              {FunctionCheckChangeColumn(id, CheckColumn, rowIndex, checked, eOpts);}
                      }
                    },
                afterrender:
                    function ( c, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].afterrender)
                            {FunctionAfterRenderColumn(id, c, eOpts);} 
                      },
                beforerender:
                    function ( c, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].beforerender)
                            {FunctionBeforeRenderColumn(id, c, eOpts);} 
                      },    
                headertriggerclick:
                    function ( ct, column, e, t, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].headertriggerclick)
                            {FunctionHeaderTriggerClickColumn(id, ct, column, e, t, eOpts);} 
                      },   
                headerclick:
                    function ( ct, column, e, t, eOpts )
                      {if (array_eventos.length > 0 )
                         if (array_eventos[0].headerclick)
                            {FunctionHeaderClickColumn(id, ct, column, e, t, eOpts);} 
                      }      
              }
            };
            
 return columna;
} 
                    
 
//ejemplo de un tpl = '<div style="text-align:center;">{dataIndex}</div>'
//este funcion toca que ralizarle ajustes por ahora se creara para que trabajae para este modulo de stanford luego se creara mas generico
 function crear_columna_action(aling='center', cls='', id, text, width, dataIndex, editor="", draggable=false, hidden=false, xtype= "templatecolumn", 
                               tpl= '', sortable=false, resizable=false, tooltip="", tooltipType='qtip', renderer="", tdCls="", style= "", 
                               menuDisabled=false, disabled=false, locked=false, layout='hbox', icon='', iconCls='', html='',  array_eventos=[]){
 var columna = new Ext.grid.column.Action({
    aling:aling,
    cls:cls,
    id: id,
    width:width,
    text: '<center>'+text+'</center>',
    dataIndex: dataIndex,
    editor: editor,
    draggable: draggable,
    hidden: hidden,
    xtype: xtype,
    tpl: tpl,
    sortable: sortable,
    resizable: resizable,
    tooltip: tooltip,
    tooltipType: tooltipType,
    renderer: renderer,
    tdCls: tdCls,
    style: style,
    menuDisabled: menuDisabled,
    disabled: disabled,
    locked: locked,
    layout: layout,
    icon: icon,
    iconCls: iconCls,
    html: html,
    listeners: {},
    
    items: [/*{
              iconCls: 'sell-col',
              tooltip: 'Sell stock',
              handler: 
                function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
                }
             },*/ 
        
            {
            getClass: function(v, meta, rec) {
                        if (rec.get('change') < 0) {
                            return 'alert-col';
                        } else {
                            return 'buy-col';
                        }
                    },
                    getTip: function(v, meta, rec) {
                        if (rec.get('change') < 0) {
                            return 'Hold stock';
                        } else {
                            return 'Buy stock';
                        }
                    },
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex),
                            action = (rec.get('change') < 0 ? 'Hold' : 'Buy');

                        Ext.Msg.alert(action, action + ' ' + rec.get('company'));
                    }
        }]         
 });
return columna;
 }
 
 
 6|iui
function crear_tabpanel(id, width, height, margin, border=false, layout='', tabPosition="top",items=[], titleAlign="left", array_eventos=[], disabled=false, hidden=false){
    //valores de tabPosition "top","bottom"
var tab =  Ext.create ('Ext.tab.Panel',{ 
      id: id,
      width:  width,
      height: height,
      autoRender:true,
      layout: layout,
      items: items,
      margin: margin,
      border: border,
      tabPosition: tabPosition,
      titleAlign:titleAlign,
      disabled:disabled,
      hidden: hidden,
      listeners:{}
      
 });    
    
 return tab;   
}


function crear_textArea(id, width, height, margin, value_inicial="", labelAlign="left", labelPad=10, readOnly=true, fieldLabel="", labelWidth= 100, 
                        style="text-align: left;",fontFamily='arial', fontSize='12px', color='black', textAlign='left', autoScroll=true, 
                        border=false, allowBlank=true, hidden= false, disabled=false, maxLength=100, enforceMaxLength=true, tooltip="", 
                        emptyText='', array_eventos=[]){
                            
var textArea =   Ext.create('Ext.form.field.TextArea',{ 
     grow : true,
     name : pasar_a_minuscula('name_'+id),
     id   : id,
     emptyText:emptyText,
     tooltip: tooltip,
     border: border,
     labelWidth:labelWidth,
     fieldLabel:'<b>'+fieldLabel+'</b>',
     width    : width,
     height   : height,
     readOnly : readOnly,
     autoScroll: autoScroll,
     maxLength:maxLength,
     enforceMaxLength:enforceMaxLength,
     fieldStyle: {
                 'fontFamily'   : fontFamily,
                 'fontSize'     : fontSize,
                 'color': color,
                 'textAlign': textAlign
                },
     style: style,
     margin: margin,
     value: value_inicial,
     labelAlign:labelAlign,
     labelPad:labelPad,
     allowBlank:allowBlank,
     hidden:hidden,
     disabled:disabled,
     listeners:{
           show:
             function(){
                 if (array_eventos.length > 0){
                     if (array_eventos[0].show)
                        {functionShowTextArea(id);}
                 }
              },
            render : 
              function(c) {
                if (array_eventos.length > 0){
                  if (array_eventos[0].render){ 
                      Ext.create('Ext.tip.ToolTip', {
                      target: c.getEl(),
                       html: c.tooltip
                       });
                  }   
                }
              }   
          }     
});
return textArea;
}


function crear_label(id, text, width, height, margin='0 0 0 0', hidden= false, disabled=false, style_font= 'Georgia', style_fontsize= '14px', 
                    style_color='black', html='', cls='', tooltip="", array_eventos=[]){
 var label =  Ext.create ('Ext.form.Label',{
  id: id,
  cls:cls,
  disabled: disabled,
  hidden: hidden,
  height: height,
  name: "name_"+id,
  width: width,
  html: html,
  margin:margin,
  text: text,
  tooltip:tooltip,
  style: {'font-size': style_fontsize,
          'font-family': style_font,
          'color': style_color
         },
            
  listeners :{ 
     render : 
        function(c) {
                if (array_eventos.length > 0){
                  if (array_eventos[0].render){ 
                      Ext.create('Ext.tip.ToolTip', {
                      target: c.getEl(),
                       html: c.tooltip
                       });
                  }   
                }
        }
    }       
 }); 
 
 return label;                         
}

  
 function crear_columna_action_version_1(aling='center', id, text, width, dataIndex, draggable=false, hidden=false, sortable=false, resizable=false, 
                                         menuDisabled=false, disabled=false, locked=false, layout='hbox', tooltip='', tooltipType='qtip',
                                         columna_funciones=[]){

//ejemplo de columna_funciones=[{getClass: false, getTip: false, handler:false}, {getClass: false, getTip: false, handler:false}, ....])     
var columna = new Ext.grid.column.Action({
    aling:aling,
    id: id,
    width:width,
    text: '<center>'+text+'</cente>',
    dataIndex: dataIndex,
    draggable: draggable,
    hidden: hidden,
    sortable: sortable,
    resizable: resizable,
    menuDisabled: menuDisabled,
    disabled: disabled,
    locked: locked,
    layout: layout,
    tooltip: tooltip,
    tooltipType:tooltipType,
    
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    items: [{
               getClass: function(value, metaData, record, rowIndex, colIndex, store) {
                           if (columna_funciones.length > 0 ){  
                               if(columna_funciones[0].getClass)
                                   {return functionGetClassColumnAction(id, value, metaData, record, rowIndex, colIndex, store);}
                            }
                         },
                       
               getTip: function(value, metaData, record, rowIndex, colIndex, store) {
                         if (columna_funciones.length > 0 ){
                            if(columna_funciones[0].getTip)
                              {return functionGetTipColumnAction(id, value, metaData, record, rowIndex, colIndex, store);}
                          }   
                        },  
                       
               handler: function(grid, rowIndex, colIndex, item, e, record, row) {
                         if (columna_funciones.length > 0 ){
                             if(columna_funciones[0].handler){
                                //var record = grid.getStore().getAt(rowIndex);
                                functionHandler_2_ColumnaAction(id, grid, rowIndex, colIndex, item, e, record, row);
                              }
                          }    
                       }
                    
            }]      
             
 });
return columna;
 }       
 
 
 
 function crear_columna_action_version_2(aling='center', id, text, width, dataIndex, draggable=false, hidden=false, sortable=false, resizable=false, 
                                         menuDisabled=false, disabled=false, locked=false, layout='hbox', tooltip='', tooltipType='qtip',
                                         columna_de_iconos=[]){

//ejemplo de columna_de_iconos=[{iconCls:'', icon:'' tooltip:'', handler:false}, {iconCls:'', tooltip:'', handler:false}, .....] asi por cada columna que se cree 
var columna = new Ext.grid.column.Action({
    aling:aling,
    id: id,
    width:width,
    text: '<center>'+text+'</center>',
    dataIndex: dataIndex,
    draggable: draggable,
    hidden: hidden,
    sortable: sortable,
    resizable: resizable,
    menuDisabled: menuDisabled,
    disabled: disabled,
    locked: locked,
    layout: layout,
    tooltip: tooltip,
    tooltipType:tooltipType,
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    items: [{
              iconCls: retornar_valor_propiedad(array=columna_de_iconos, indice_a_devolver=0, indice='iconCls'),
              icon:    retornar_valor_propiedad(array=columna_de_iconos, indice_a_devolver=0, indice='icon'),
              tooltip: retornar_valor_propiedad(array=columna_de_iconos, indice_a_devolver=0, indice='tooltip'),
              handler: 
                function (grid, rowIndex, colIndex) {
                    if (columna_de_iconos.length > 0 ){  
                       if (columna_de_iconos[0].handler)
                          {var record = grid.getStore().getAt(rowIndex);
                           functionHandlerColumnaAction(id, grid, rowIndex, colIndex, record);
                          }
                       }    
                    } 
             }]
}); 
 return columna;
};


 function crear_columna_action_version_3(aling='center', id, text, width, dataIndex, draggable=false, hidden=false, sortable=false, resizable=false, 
                                         menuDisabled=false, disabled=false, locked=false, layout='hbox', tooltip='', tooltipType='qtip',
                                         items=[]){

//ejemplo de columna_de_iconos=[{iconCls:'', icon:'' tooltip:'', handler:false}, {iconCls:'', tooltip:'', handler:false}, .....] asi por cada columna que se cree 
var columna = new Ext.grid.column.Action({
    aling:aling,
    id: id,
    width:width,
    text: '<center>'+text+'</center>',
    dataIndex: dataIndex,
    draggable: draggable,
    hidden: hidden,
    sortable: sortable,
    resizable: resizable,
    menuDisabled: menuDisabled,
    disabled: disabled,
    locked: locked,
    layout: layout,
    tooltip: tooltip,
    tooltipType:tooltipType,
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    items: items
}); 
 return columna;
};


 function retornar_valor_propiedad(array, indice_a_devolver, indice){
     if (array.length > 0)
       { switch(indice) {
             case 'iconCls':
                  return array[indice_a_devolver].iconCls;
             break;
                   
             case 'icon':
                   return array[indice_a_devolver].icon;
             break;
             
             case 'tooltip':
                   return array[indice_a_devolver].tooltip;
             break;
          }    
      }   
         
       
   return Ext.BLANK_IMAGE_URL;  
 }
 
     
 

var tpl_proceso_upload_finalizado = new Ext.XTemplate(
        'Archivo almacenado en el servidor.<br/>',
        'Archivo: {fileName}<br/>',
        'Tañamo:  {fileSize} Kbytes<br/>',
        'Nombre en servidor: {fileNameServer}<br>',
        'Nuevo Nombre: {nuevoNombre}'
 ); 
 
 
function panel_upload_file(id_panel, width, titulo, items=[], buttons=[], border=false, margin='0 0 0 0', frame=true){
/*ejemplo de una arreglo items=[{xtype:'filefield', id:'', emptyText:'Seleccione un archivo', fieldLabel:'Path Origen', labelWidth:100, 
                                 name:'path_archivo', buttonText:'', iconCls:'upload-icon'}];*/


/* ejemplo de un arreglo buttons =[{id:'', text:'Guardar', handler:[{url:'URL_file_upload', tpl:tpl_proceso_upload_finalizado}]},
 *                                 {id:'', text:'Reset'}] */
 

 var form_upload =  Ext.create('Ext.form.Panel', {
id: id_panel,
width: width,
frame: frame,
title: titulo,
autoScroll: false,
border: border,
margin: margin,
defaults: {
 anchor: '100%',
 allowBlank: false,
 msgTarget: 'side',
 labelWidth: 50
},

items: 
  [{
    xtype: items[0].xtype,
    id: items[0].id,
    emptyText: items[0].emptyText,
    fieldLabel: items[0].fieldLabel,
    labelWidth: items[0].labelWidth,
    name: items[0].name,
    buttonText: items[0].buttonText,
    buttonConfig: 
     {iconCls: items[0].iconCls}
  }],

buttons: 
  [{text: buttons[0].text,
    id: buttons[0].id,
    handler: 
     function()
        {var form = this.up('form').getForm();
         if(form.isValid()){
            form.submit({
               url: buttons[0].handler[0].url,
               params: 
                  {},
               waitMsg: 'Uploading archivo Seleccionado...',
               success: 
                  function(form, action)
                    {Ext.Msg.alert('Éxito', buttons[0].handler[0].tpl.apply(action.result));
                     ruta_file_upload = action.result.fileNameServer; 
                     function_colocar_ruta_en_label(ruta_file_upload, id_panel);
                    },
               failure: 
                  function(form, action)
                    {switch (action.failureType) {
                       case Ext.form.action.Action.CLIENT_INVALID:
                            Ext.Msg.alert('Error', 'Form fields may not be submitted with invalid values');
                            break;
                       case Ext.form.action.Action.CONNECT_FAILURE:
                            Ext.Msg.alert('Error', 'Ajax comunicación fallida');
                            break;
                       case Ext.form.action.Action.SERVER_INVALID:
                            Ext.Msg.alert('Error', action.result ? action.result : 'No response');
                            
                       default:   
                        Ext.Msg.alert('Error', action.result );   
                     }
                    }
            });
        }
     }   
  },
  {text: buttons[1].text,
   id: buttons[1].id,
   handler: function() {
          this.up('form').getForm().reset();
   }
  }],
    
listeners:{}
});
return form_upload;
}
