function SubmitFormularioConvocatoriaDatosGenerales(){
var form = Ext.getCmp('IDFormularioDatosGeneralesConvocatoria').getForm();

if(form.isValid()){
  form.submit({
    url: "URLSubmitFormularioConvocatoria",
    params: 
        {},
    waitMsg: 'Almacenando Formulario',
    success: 
     function(form, action)
       {
        if (action.result['success'])
           {TextCodigoConvocatoria.setValue(action.result['codigo']);
            Ext.Msg.alert('Éxito', action.result['message']);
            PanelParticipantesPorConvocatoria.setDisabled(false);
            PanelOtraConfigPorParticipantePorConvocatoria.setDisabled(false);
            
            cargar_lista_perfiles_por_convocatoria(parseInt(TextCodigoConvocatoria.getValue())); 
            cargar_lista_conveniosporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));
            cargar_lista_condicionesporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));
            cargar_lista_compromisosporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));                    
            cargar_lista_beneficiosporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));
            cargar_lista_costosasumidosporpostulanteporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));                                                          
            cargar_lista_otras_observaciones(parseInt(TextCodigoConvocatoria.getValue()));
           }
        else
           {Ext.Msg.alert('Alerta', action.result['message']);}
       },
                    
    failure: 
      function(form, action)
        {switch (action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
                Ext.Msg.alert('Error 1', 'Form fields may not be submitted with invalid values');
                break;
            case Ext.form.action.Action.CONNECT_FAILURE:
                 Ext.Msg.alert('Error 2', 'Ajax comunicación fallida');
                 break;
            case Ext.form.action.Action.SERVER_INVALID:
                 Ext.Msg.alert('Error 3', action.result ? action.result : 'No response');
                            
            default:   
                 Ext.Msg.alert('Advertencia', action.result['message'] );   
          }
        }
  });
 }
else
 {Ext.Msg.alert('Alerta', 'El formulario se encuentra incompleto en su diligenciamiento')}
}

function ResetFormularioConvocatoriaPestañaGeneral(){
     Ext.getCmp('IDFormularioDatosGeneralesConvocatoria').getForm().reset();
}

function ResetFormularioPublicoConvocatoria(){
     Ext.getCmp('IDFormularioPublicoConvocatoria').getForm().reset();
}

function ResetFormularioMovilidaEstudianteNacional(){
     Ext.getCmp('IDFormularioMovilidaEstudianteNacional').getForm().reset();
}

function activar_deshabilitar_perfil_por_convocatoria_por_tipo_movilidad(valor, codigo_perfil, convocatoria){
   cargar_store_objeto("URLActivarDesactivarPerfilPorConvocatoriaPorTipoMovilidad", id_store="IDStoreGridListaPerfilesParaConvocatoria", 
                       {codigo_perfil:codigo_perfil,
                        valor: valor,
                        codigo_convocatoria: convocatoria
                       }, error="No se pudo realizar el proceso solicitado", timeout= 180000, fnCallback=false); 
}

function activar_deshabilitar_requisitoparalaconvocatoriaporperfil(valor, codigo_perfil, codigo_requisito, convocatoria, accion){
   cargar_store_objeto("URLActivarDesactivarRequisitoPorPerfilPorConvocatoria", id_store="IDStoreGridListaRequisitosPorConvocatoriaPorPerfil", 
                       {codigo_perfil:codigo_perfil,
                        valor: valor,
                        codigo_convocatoria: convocatoria,
                        codigo_requisito: codigo_requisito,
                        accion_requisito: accion
                       }, error="No se pudo realizar el proceso de activar/deshabilitar requisito", timeout= 180000, fnCallback=false);    
    
    
    
}

function cambiar_accion_al_requisito_por_convocatoria_por_perfil(nueva_accion, convocatoria, requisito, perfil, vieja_accion){
     cargar_store_objeto("URLCambiarAccionPorRequisitoPorConvocatoriaPorPerfil", id_store="IDStoreGridListaRequisitosPorConvocatoriaPorPerfil", 
                         {nueva_accion:nueva_accion,
                          vieja_accion: vieja_accion,   
                          codigo_convocatoria: convocatoria,
                          codigo_requisito: requisito,
                          codigo_perfil: perfil
                         }, error="No se pudo realizar el proceso de cambio de accion para el requisito", timeout= 180000, fnCallback=false);   
} 

function cambiar_accion_al_documento_por_convocatoria_por_perfil(nueva_accion, convocatoria, documento, perfil, vieja_accion){
 cargar_store_objeto("URLCambiarAccionPorDocumentoPorConvocatoriaPorPerfil", id_store="IDStoreGridListaDocumentosPorPerfilPorConvocatoria", 
                 {nueva_accion:nueva_accion,
                  vieja_accion: vieja_accion,   
                  codigo_convocatoria: convocatoria,
                  codigo_documento: documento,
                  codigo_perfil: perfil
                 }, error="No se pudo realizar el proceso de cambio de accion para el documento", timeout= 180000, fnCallback=false);   


}

function cambiar_accion_al_compromiso_por_convocatoria(nueva_accion, convocatoria, compromiso, vieja_accion){
cargar_store_objeto("URLCambiarAccionPorCompromisoPorConvocatoria", id_store="IDStoreGridCompromisos", 
                 {codigo_vieja_accion: vieja_accion,   
                  codigo_convocatoria: convocatoria,
                  codigo_compromiso: compromiso,
                  codigo_nueva_accion: nueva_accion
                 }, error="No se pudo realizar el proceso de cambio de accion para el compromiso", timeout= 180000, fnCallback=false);      
}

function calcular_sumatoria_de_porcentajes(store){
var sumatoria = 0;
var records = store.getRange();

Ext.each(records, function(record){
    sumatoria += record.get('porcentaje');
});
 
 return sumatoria;   
}

function buscar_max_porcentaje_aplicar(){
    return 100 - sumatoria_porcentajes_criterios_de_evaluacion;
}

function actualizar_valores_maximos_porcentajes(store){
sumatoria_porcentajes_criterios_de_evaluacion = calcular_sumatoria_de_porcentajes(store);
SumatoriaPorcentajeCriteriosDeEvaluacion.setValue(sumatoria_porcentajes_criterios_de_evaluacion);
EditorPorcentajeCriterioEvaluacionPorConvocatoriaPorPerfil.setMaxValue(buscar_max_porcentaje_aplicar());    
}

function activar_deshabilitar_documentoparalaconvocatoriaporperfil(valor, codigo_perfil, codigo_documento, convocatoria, accion){
cargar_store_objeto("URLActivarDesactivarDocumentoPorPerfilPorConvocatoria", id_store="IDStoreGridListaDocumentosPorPerfilPorConvocatoria", 
                    {codigo_perfil:codigo_perfil,
                     valor: valor,
                     codigo_convocatoria: convocatoria,
                     codigo_documento: codigo_documento,
                     accion_documento: accion
                    }, error="No se pudo realizar el proceso de activar/deshabilitar documento", timeout= 180000, fnCallback=false);     
    
}

function cargar_lista_conveniosporconvocatoria(codigo_convenio){
 cargar_store_objeto("URLListarConveniosPorConvocatoria", id_store="IDStoreGridListaConveniosPorConvocatoria", {codigo_convocatoria:codigo_convenio},
                     error="No se pudo cargar lista de convenios", timeout= 180000, fnCallback=false);   
}

function cargar_lista_compromisosporconvocatoria(codigo_convenio){
 cargar_store_objeto("URLListarCompromisosPorConvocatoria", id_store="IDStoreGridCompromisos", {codigo_convocatoria:codigo_convenio}, 
                     error="No se pudo cargar lista de compromisos", timeout= 180000, fnCallback=false);
}

function cargar_lista_condicionesporconvocatoria(codigo_convenio){
 cargar_store_objeto("URLListarCondicionesPorConvocatoria", id_store="IDStoreGridCondiciones", {codigo_convocatoria:codigo_convenio}, 
                     error="No se pudo cargar lista de compromisos", timeout= 180000, fnCallback=false);
}

function cargar_lista_beneficiosporconvocatoria(codigo_convenio){
cargar_store_objeto("URLListarBeneficiosPorConvocatoria", id_store="IDStoreGridBeneficios", {codigo_convocatoria: codigo_convenio}, 
                    error="No se pudo cargar lista de Beneficios", timeout= 180000, fnCallback=false); 
}

function cargar_lista_costosasumidosporpostulanteporconvocatoria(codigo_convenio){
cargar_store_objeto("URLListarCostosAsumidosPorPostulantePorConvocatoria", id_store="idStoreCostosAsumidosPorPostulante", 
                    {codigo_convocatoria: codigo_convenio}, error="No se pudo cargar lista de Costos Asumidos por el postulante", 
                    timeout= 180000, fnCallback=false);    
}

function cargar_lista_otras_observaciones(codigo_convenio){
cargar_store_objeto("URLListarOtrasObeservacionesPorConvocatoria", id_store="idStoreGridListarOtrasObservaciones", 
                     {codigo_convocatoria: codigo_convenio}, error="No se pudo cargar lista de Otras Observaciones", 
                     timeout= 180000, fnCallback=false);        
}

function cargar_lista_perfiles_por_convocatoria(codigo_convenio){
cargar_store_objeto("URLListarPerfilesPorConvocatoria", id_store="IDStoreGridListaPerfilesParaConvocatoria", 
                    {codigo_convocatoria: codigo_convenio}, error="No se pudo cargar lista de perfiles", timeout= 180000, fnCallback=false);    
}

function cargar_formulario_publico_o_interno_convocatoria(){
FormularioPublicoConvocatoria.getForm().load({
url:"URLBuscarConvocatoriaFormularioPublico?t="+ new Date().getTime(),
params:{codigo_convocatoria: URLcodigo_convocatoria},
method: "POST",
timeout: 200000,
waitMsg: "Buscando Datos de convocatoria ",
success:
 function(form, action){
   var data = action.result['data'];  
   fmPublicoLabelTituloConvocatoria.setText(data['name_idfmpublicolabeltituloconvocatoria']);
   formulario_aplicar_a_la_convocatoria = data['formulario_aplica_postulante'];
   nombre_movilidad_de_la_convocatoria = data['nombre_movilidad'];
   data_datos_basicos_convocatoria = data;  
 },
failure:
   function(form, action){
      switch (action.failureType) {
         case Ext.form.action.Action.CLIENT_INVALID:
              Ext.Msg.alert('Error 1', 'Form fields may not be submitted with invalid values');
              break;
         case Ext.form.action.Action.CONNECT_FAILURE:
              Ext.Msg.alert('Error 2', 'Ajax comunicación fallida');
              break;
         case Ext.form.action.Action.SERVER_INVALID:
              Ext.Msg.alert('Error 3', action.result ? action.result : 'No response');

         default:   
              Ext.Msg.alert('ADVERTENCIA', action.result['message'] );   
      }
 }   

});    
}

function preparar_formulario_estudiantes_nacionales(){
    ResetFormularioMovilidaEstudianteNacional();
    cargar_store_objeto(url="URLCargarGenero", "IDStoreComboBoxGenero", [], "Error, No se pudo cargar lista de generos", timeout= 180000, fnCallback=false);
    cargar_store_objeto(url="URLCargarEstadoCivil", "IDStoreComboBoxEstadoCivil", [], "Error, No se pudo cargar lista de estados civiles", timeout= 180000, fnCallback=false);
    cargar_store_objeto(url="URLCargarPaisNacimiento", "IDStoreComboBoxPaisNacimiento", [], "Error, No se pudo cargar lista de paises", timeout= 180000, fnCallback=false);
    cargar_store_objeto(url="URLTiposDeDocumneto", "IDStoreComboBoxTipoDocumento", [], "Error, No se pudo cargar lista de documentos", timeout= 180000, fnCallback=false);
    cargar_store_objeto(url="URLLugarExpedicion", "IDStoreComboBoxLugarExpedicion", [], "Error, No se pudo cargar lista de lugares de expedición", timeout= 180000, fnCallback=false);    
    cargar_store_objeto(url="URListarEPS", "IDStoreComboBoxEPS", [], "Error, No se pudo cargar lista de EPS", timeout= 180000, fnCallback=false);    
    cargar_store_objeto(url="URListarLugarResidencia", "IDStoreComboBoxCiudadResidencia", [], "Error, No se pudo cargar lista de ciudades residencia", timeout= 180000, fnCallback=false);    
    cargar_store_objeto(url="URListarParentesco", "IDStoreComboBoxParentesco", [], "Error, No se pudo cargar lista de parentesco", timeout= 180000, fnCallback=false);    
    cargar_store_objeto(url="URListarAreaPromueveActividad", "IDStoreComboBoxAreaPromueveActividad", [], "Error, No se pudo cargar lista areas que promueven la actividad", timeout= 180000, fnCallback=false);    
    TipoDeMovilidad.setValue(nombre_movilidad_de_la_convocatoria);
    FechaInicioActividad.setValue(formatDate(fmPublicoConvocatoriaTextFechaInicioProcesoConvocatoria.getValue()));
    FechaFinActividad.setValue(formatDate(fmPublicoConvocatoriaTextFechaFinProcesoConvocatoria.getValue()));
    NombreProgramaAcademicoCursoADesarrollar.setValue(data_datos_basicos_convocatoria['name_idfmpublicolabeltituloconvocatoria']);
    cargar_store_objeto(url="URListarInstitucionesXConvenio", "IDStoreComboBoxInstitucionDondeRealizaLaActividad", {convocatoria:data_datos_basicos_convocatoria['codigo_convocatoria']}, "Error, No se pudo cargar lista de conveniosXinstitucionesxpais", timeout= 180000, fnCallback=false);    
    CualGrupoPonente.setDisabled(true);
    FechaDeVinculacionAspirante.setDisabled(true);
    CheckActualmenteVinculadoGrupoPonente.setDisabled(true);  CheckActualmenteVinculadoGrupoPonente.setValue(false);
    CualGrupoSemillero.setDisabled(true);
    FechaDeVinculacionAspiranteGrupoSemillero.setDisabled(true);
    CheckActualmenteVinculadoGrupoSemillero.setDisabled(true);
    CheckActualmenteVinculadoGrupoSemillero.setValue(false);
        
    ComboBoxDepartamentoNacimientoPostulante.setDisabled(true);
    ComboBoxCiudadNacimientoPostulante.setDisabled(true);
    OtraAreaQuePromueveActividad.setDisabled(true);    
}


function SubmitFormularioMovilidadEstudianteNacionales(){
var form = Ext.getCmp('IDFormularioMovilidaEstudianteNacional').getForm();

alert(PreguntaCheckPrimeravezqueViaja.getValue());
if(form.isValid()){
  form.submit({
    url: "URLSubmitFormularioMovilidadEstudianteNacionales",
    params: 
        {formulario_aplicado:formulario_aplicar_a_la_convocatoria,
         convocatoria: data_datos_basicos_convocatoria['codigo_convocatoria'],
         codigo_facultad: codigo_facultad_de_un_estudiante_interno,
         codigo_programa: codigo_programaacademico_de_un_estudiante_interno,
         codigo_estudiante: codigo_estudiante_llenado_formulario,
         codigo_postulante_seleccionado: 6, //codigo_postulante_seleccionado,
         otra_area_actividad: OtraAreaQuePromueveActividad.getValue(),
         pregunta_viaje: PreguntaCheckPrimeravezqueViaja.getValue(),
         pregunta_ponente: PreguntaCheckParticipadoComoPonente.getValue(),
         GrupoPonente: CualGrupoPonente.getValue(),
         FechaDeVinculacionAspirante: FechaDeVinculacionAspirante.getValue(),
         CheckActualmenteVinculadoGrupoPonente: CheckActualmenteVinculadoGrupoPonente.getValue(),
         PreguntaSemilleroInvestigacion: PreguntaCheckParticipacionSemilleroInvestigacion.getValue(),
         GrupoSemillero: CualGrupoSemillero.getValue(),
         FechaDeVinculacionSemillero: FechaDeVinculacionAspiranteGrupoSemillero.getValue(),
         ActualmenteVinculadoGrupoSemillero: CheckActualmenteVinculadoGrupoSemillero.getValue(),
         AreaReconocimientos: AreaReconocimientos.getValue(),
         InstitucionDondeRealizaLaActividad: ComboBoxInstitucionDondeRealizaLaActividad.getValue(),
         pais: PaisRealizaActividad.getValue(),
         data_lengua_extranjera : Ext.JSON.encode(traer_datos_a_guardar('IDStoreGridConociminetoLenguaExtranjera')),
         data_grupos : Ext.JSON.encode(traer_datos_a_guardar('IDStoreGridGruposDondePertenece'))


        },
    waitMsg: 'Almacenando Formulario',
    success: 
     function(form, action)
       {
        if (action.result['success'])
           {
           }
        else
           {Ext.Msg.alert('Alerta', action.result['message']);}
       },
                    
    failure: 
      function(form, action)
        {switch (action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
                Ext.Msg.alert('Error 1', 'Form fields may not be submitted with invalid values');
                break;
            case Ext.form.action.Action.CONNECT_FAILURE:
                 Ext.Msg.alert('Error 2', 'Ajax comunicación fallida');
                 break;
            case Ext.form.action.Action.SERVER_INVALID:
                 Ext.Msg.alert('Error 3', action.result ? action.result : 'No response');
                            
            default:   
                 Ext.Msg.alert('Advertencia', action.result['message'] );   
          }
        }
  });
 }
else
 {Ext.Msg.alert('Alerta', 'El formulario se encuentra incompleto en su diligenciamiento');}
}