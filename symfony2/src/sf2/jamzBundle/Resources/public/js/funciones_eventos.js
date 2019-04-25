function functionClickBoton(id, index){
    switch(id) {
    case "IDBotonAgregarGrupoAQuePertenece":
        crear_nuevo_record_en_una_grid(StoreGridGruposDondePertenece,retornar_record_grupo_a_que_pertenece());
        break;
        
    case "IDBotonAgregarLenguaExtranjrera":
        crear_nuevo_record_en_una_grid(StoreGridConociminetoLenguaExtranjera,retornar_record_lenguaextranjera());
         break;
    case "IDBotonPostularPersonaAConvocatoria":
          switch(formulario_aplicar_a_la_convocatoria) {
           case 1:
           case 3:
           case 4:    
                alert('Error en llamado del formulario validar con el administrador');
                 break;
          case 2:
                abrir_ventana("IDVentanaFormularioMovilidaEstudianteNacional");
                break;
                
          default:
               Ext.Msg.alert('Advertencia', 'Primero Seleccione una convocatoria a postularse');
                 break;
           }
        break;
        
    case "IDBotonNuevaPostulacion":
        abrir_ventana("IDventana_seleccionar_convocatoria_vigente");
        break;
        
    case "ID_buscar_convocatoria":
        cargar_store_objeto(url="URLBuscarConvocatoria", id_store="IDStoreGridRespuestaBusquedaConvocatoria", {filtro:TextFiltroBusquedaConvocatoria.getValue()}, 
                            error="Se presentó un error en Ajax URLBuscarConvocatoria", timeout= 180000, fnCallback=false); 
                          
        abrir_ventana('IDVentanaRespuestaBusqueda'); 
        break;            
        
    case "IDBotonGuardarFormularioPostulacionMovilidaEstudianteNacional":
         SubmitFormularioMovilidadEstudianteNacionales();
         break;
     
    case "IDGuardarActualziarConvocatoria":
        SubmitFormularioConvocatoriaDatosGenerales();
        break;
      
    case "IDBotonCrearConvocatoria":
        TabConfiguracion.setDisabled(false); 
        TabConfiguracion.setActiveItem(PanelDatosGeneralesConvocatoria);
        PanelParticipantesPorConvocatoria.setDisabled(true);
        PanelOtraConfigPorParticipantePorConvocatoria.setDisabled(true);
        ResetFormularioConvocatoriaPestañaGeneral();
        break;
        
    case "IDBotonValidarConfiguracionDeCriteriosDeEvaluacion":    
        if (SumatoriaPorcentajeCriteriosDeEvaluacion.getValue() !== 100)
           {Ext.Mag.alert('Advertencia', 'NO se puede almacenar la configuración porque no tiene e 100% de porcentaje');}
        else
           {var data = traer_datos_a_guardar("IDStoreGridCriteriosDeEvaluacionPorPerfilPorConvocatoria", true);
            cargar_store_objeto("URLGuardarConfiguracionPorcentajesCriteriosDeEvaluacionPorPerfilPorConvocatoria", id_store="IDStoreGridCriteriosDeEvaluacionPorPerfilPorConvocatoria", 
                       {data}, error="No se pudo realizar el proceso de guardado de porcentaje", timeout= 180000, fnCallback=false);    
               
           }
        break;
    }
}

function FunctionLoadStore(id, store, records, successful, eOpts){
     switch(id) {
        case "IDStoreComboBoxAcciones":
             ComboBoxAcciones.setValue(accion_del_requisito_seleccionado);           
             break;
             
        case "IDStoreGridCriteriosDeEvaluacionPorPerfilPorConvocatoria":
                actualizar_valores_maximos_porcentajes(store);
             break
             
        case "IDStoreComboBoxAccionesDocumentos":
              ComboBoxAccionesDocumentos.setValue(accion_del_documento_seleccionado); 
              break;
              
        case "IDStoreComboBoxAccionesCompromisos":
              ComboBoxAccionesCompromisos.setValue(accion_del_compromiso_seleccionado); 
              break;
    }
}

function functionShowWindow(id){
  switch(id) {
    case 'IDVentanaRespuestaBusqueda':
    case 'IDVentanaRequisitosPorPerfilPorConvocatoria':    
    case 'IDVentanaCriteriosdeEvaluacion': 
    case 'IDVentanaDocumentoPorPerfilPorConvocatoria':
    case 'IDVentanaComboBoxAccionesCompromisos':    
        RegionCentralConfiguracionInternacionalizacion.setDisabled(true); 
        break;
    
    case "IDVentanaComboBoxAcciones":      
        Ext.getCmp('IDVentanaRequisitosPorPerfilPorConvocatoria').setDisabled(true);
        break;
    
    case "IDVentanaComboBoxAccionesDocumento":        
        Ext.getCmp('IDVentanaDocumentoPorPerfilPorConvocatoria').setDisabled(true);    
        break;
        
    case "IDventana_seleccionar_convocatoria_vigente":    
        cargar_store_objeto(url="URL_listar_convocatorias_vigentes", id_store="IDStoreComboBoxConvocatoriasVigentes", [], 
        error="Se presento un error al cargar convocatorias vigentes", timeout= 180000, fnCallback=false);
        
        Ext.getCmp('IDRegionCentralFormularioPublicoConvocatoria').setDisabled(true);
        ResetFormularioPublicoConvocatoria();
        break;
        
    case "IDVentanaFormularioMovilidaEstudianteNacional":
        Ext.getCmp('IDRegionCentralFormularioPublicoConvocatoria').setDisabled(true);
        preparar_formulario_estudiantes_nacionales();
        break;
    }  
}

function functionCloseWindow(id){
  switch(id) {
    case 'IDVentanaRespuestaBusqueda':
    case 'IDVentanaRequisitosPorPerfilPorConvocatoria':
    case 'IDVentanaCriteriosdeEvaluacion':      
    case 'IDVentanaDocumentoPorPerfilPorConvocatoria':
    case 'IDVentanaComboBoxAccionesCompromisos':    
       RegionCentralConfiguracionInternacionalizacion.setDisabled(false);            
       break;
      
    case "IDVentanaComboBoxAcciones":    
        Ext.getCmp('IDVentanaRequisitosPorPerfilPorConvocatoria').setDisabled(false);
        break;    
      
    case "IDVentanaComboBoxAccionesDocumento":        
        Ext.getCmp('IDVentanaDocumentoPorPerfilPorConvocatoria').setDisabled(false);    
        break;  
    
    case "IDventana_seleccionar_convocatoria_vigente":    
        Ext.getCmp('IDRegionCentralFormularioPublicoConvocatoria').setDisabled(false);
        break;
    
    case "IDVentanaFormularioMovilidaEstudianteNacional":       
        Ext.getCmp('IDRegionCentralFormularioPublicoConvocatoria').setDisabled(false);
        break;    
    }  
}

function FunctionGridCellDblclick(id, grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
    switch(id) {
    case "IDGridResultadoBusquedaConvocatoria":
        ResetFormularioConvocatoriaPestañaGeneral();
        FormularioDatosGeneralesConvocatoria.getForm().load({
            url:"URLBuscarDatosGeneralesConvocatoria",
            params:{codigo_convocatoria: record.get('codigoconvocatoria')},
            method: "POST",
            timeout: 200000,
            waitMsg: "Busando Datos Generales espere por favor... ",
            success:
                 function(form, action){
                    TabConfiguracion.setDisabled(false); 
                    PanelParticipantesPorConvocatoria.setDisabled(false);
                    PanelOtraConfigPorParticipantePorConvocatoria.setDisabled(false);
                                        
                    cargar_lista_perfiles_por_convocatoria(parseInt(TextCodigoConvocatoria.getValue())); 
                    cargar_lista_conveniosporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));
                    cargar_lista_condicionesporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));
                    cargar_lista_compromisosporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));                    
                    cargar_lista_beneficiosporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));
                    cargar_lista_costosasumidosporpostulanteporconvocatoria(parseInt(TextCodigoConvocatoria.getValue()));                                                          
                    cargar_lista_otras_observaciones(parseInt(TextCodigoConvocatoria.getValue()));           
                                       
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
                             Ext.Msg.alert('Error 4', action.result['message'] );   
                      }
                 }   
        
        });
        VentanaRespuestaBusqueda.close();
         break;
        
        
    }  
}

function functionComboBoxSelect(id, combo, records, eOpts){
    switch(id) {
    case "IDComboBoxInstitucionDondeRealizaLaActividad":
          if (records !== "" && records !== null)
              {PaisRealizaActividad.setValue(records.get('nombre_pais'));}
              
          break;
    case "IDComboBoxAreaPromueveActividad":    
          if (records !== "" && records !== null)
              {if (records.get('es_otra'))
                  {OtraAreaQuePromueveActividad.setDisabled(false);}
               else
                  {OtraAreaQuePromueveActividad.setDisabled(true);}
               OtraAreaQuePromueveActividad.setValue();   
              }
          break;
    case "IDComboBoxPaisNacimientoPostulante":    
         ComboBoxDepartamentoNacimientoPostulante.setDisabled(false);
         ComboBoxDepartamentoNacimientoPostulante.setValue();
         ComboBoxCiudadNacimientoPostulante.setValue(); 
         ComboBoxCiudadNacimientoPostulante.setDisabled(true);
         cargar_store_objeto(url="URLCargarDepartamentoNacimiento", "IDStoreComboBoxDepartamentoNacimiento", {pais:combo.getValue()}, "Error, No se pudo cargar lista de departamento", timeout= 180000, fnCallback=false);         
         break;
     
    case "IDComboBoxDepartamentoNacimientoPostulante":
         ComboBoxCiudadNacimientoPostulante.setDisabled(false);
         ComboBoxCiudadNacimientoPostulante.setValue();      
         cargar_store_objeto(url="URLCargarCiudadNacimiento", "IDStoreComboBoxCiudadNacimiento", {region:combo.getValue()}, "Error, No se pudo cargar lista de ciudades", timeout= 180000, fnCallback=false);         
        break;
        
    case "IDComboBoxConvocatoriaVigentes":
        URLcodigo_convocatoria = combo.getValue();
        ventana_seleccionar_convocatoria_vigente.close();
        cargar_formulario_publico_o_interno_convocatoria();
        break;
    
    case 'IDComboBoxAcciones':    
        VentanaComboBoxAcciones.close();
        cambiar_accion_al_requisito_por_convocatoria_por_perfil(combo.getValue(), 
                                                                parseInt(TextCodigoConvocatoria.getValue()), 
                                                                codigo_requisito_por_perfil_por_convocatoria_seleccionado,
                                                                codigo_perfil_seleccionado_en_requisitos,
                                                                codigo_accion_actual_requisito_por_perfil_por_convocatoria
                                                               );
        break;
        
    case "IDComboBoxAccionesDocumentos":
        VentanaComboBoxAccionesDocumento.close();
        cambiar_accion_al_documento_por_convocatoria_por_perfil(combo.getValue(), 
                                                                parseInt(TextCodigoConvocatoria.getValue()), 
                                                                codigo_documento_por_perfil_por_convocatoria_seleccionado,
                                                                codigo_perfil_seleccionado_en_documento,
                                                                codigo_accion_actual_documento_por_perfil_por_convocatoria
                                                               ); 
        break;
        
    case "IDComboBoxAccionesCompromisos":    
        VentanaComboBoxAccionesCompromisos.close();
        cambiar_accion_al_compromiso_por_convocatoria(combo.getValue(), 
                                                      parseInt(TextCodigoConvocatoria.getValue()), 
                                                      codigo_compromiso_por_convocatoria_seleccionado,
                                                      codigo_accion_compromiso_actual_por_convocatoria
                                                     ); 
        break;
        
    }  
}

function FunctionPluginBeforeEdit(pluginId, editor, e, eOpts){
  switch(pluginId) {
    case "IDPluginEditorCriteriosDeEvaluacionPorConvocatoriaPorPerfil":
        if (!e.record.get('se_puede_editar_puntuaciones'))
            {e.cancel=true;
             Ext.Msg.alert('Advertencia', 'No se pueden editar los porcentajes ya que hay postulados ya evaluados');   
            }
        break;
        
    case "IDPluginGridListaCompromisos":    
        if (!e.record.get('check_utilizar_compromiso'))
            {e.cancel=true;
             Ext.Msg.alert('Advertencia', 'No se pueden editar el compromiso porque no se encuentra activa');   
            }
        break;
  }  
}

function FunctionPluginEdit(pluginId, editor, e, eOpts){
  switch(pluginId) {
    case "IDPluginEditorCriteriosDeEvaluacionPorConvocatoriaPorPerfil":
         actualizar_valores_maximos_porcentajes(e.grid.getStore());
        break;
  }    
}

function FunctionCheckChangeColumn(id, CheckColumn, rowIndex, checked, eOpts){
  switch(id) {
      
    case "IdColumCheckUtilizarConvenioEnConvocatoria":
        var records = StoreGridListaConveniosPorConvocatoria.getRange();
        var rec = records[rowIndex];
        cargar_store_objeto("URLCambiarEstadoUtilizadoConvenioPorConvocatoria", id_store="IDStoreGridListaConveniosPorConvocatoria", 
                             {codigo_convocatoria:parseInt(TextCodigoConvocatoria.getValue()),
                              checked:checked,
                              convenioxinstitucion: rec.get('convenioxinstitucionxpaisxmovilidad')
                             },error="No se pudo cargar estado de utilizado del convenio", 
                             timeout= 180000, fnCallback=false);  
        break;
        
    case  "IDColumnCheckUtilizaCondicion":   
        var records = StoreGridCondiciones.getRange();
        var rec = records[rowIndex];
        cargar_store_objeto("URLCambiarEstadoUtilizadoCondicionPorConvocatoria", id_store="IDStoreGridCondiciones", 
                             {codigo_convocatoria:parseInt(TextCodigoConvocatoria.getValue()),
                              checked:checked,
                              codigo_condicion: rec.get('codigo_condicion')
                             },error="No se pudo cargar estado de utilizado de condiciones", 
                             timeout= 180000, fnCallback=false); 
        
        break;
        
    case "IdColumCheckUtilizarBeneficio":
        var records = StoreGridBeneficios.getRange();
        var rec = records[rowIndex];
        cargar_store_objeto("URLCambiarEstadoUtilizadoBeneficioPorConvocatoria", id_store="IDStoreGridBeneficios", 
                             {codigo_convocatoria:parseInt(TextCodigoConvocatoria.getValue()),
                              checked:checked,
                              codigo_beneficio: rec.get('codigo_beneficio')
                             },error="No se pudo cargar estado de utilizado de beneficios", 
                             timeout= 180000, fnCallback=false); 
        break;
        
    case "IdColumCheckUtilizarCostosAsumidos":
        var records = StoreCostosAsumidosPorPostulante.getRange();
        var rec = records[rowIndex];
        cargar_store_objeto("URLCambiarEstadoUtilizadoCostosAsumidosPorPostulantePorConvocatoria", id_store="idStoreCostosAsumidosPorPostulante", 
                             {codigo_convocatoria:parseInt(TextCodigoConvocatoria.getValue()),
                              checked:checked,
                              codigo_costos: rec.get('codigo_descripcion')
                             },error="No se pudo cargar estado de utilizado de Costos Asumidos Por el postulante", 
                             timeout= 180000, fnCallback=false); 
        break;
        
    case "IdColumCheckUtilizarOtraObservacion":
        var records = StoreGridListarOtrasObservaciones.getRange();
        var rec = records[rowIndex];
        cargar_store_objeto("URLCambiarEstadoUtilizadoOtraObservacionesPorConvocatoria", id_store="idStoreGridListarOtrasObservaciones", 
                             {codigo_convocatoria:parseInt(TextCodigoConvocatoria.getValue()),
                              checked:checked,
                              codigo_observacion: rec.get('codigo_descripcion')
                             },error="No se pudo cargar estado de utilizado de otras observaciones", 
                             timeout= 180000, fnCallback=false); 
        break; 
    
    case "IdColumCheckUtilizaCompromiso":
        var records = StoreGridCompromisos.getRange();
        var rec = records[rowIndex];
        cargar_store_objeto("URLCambiarEstadoUtilizadoCompromisoPorConvocatoria", id_store="IDStoreGridCompromisos", 
                             {codigo_convocatoria:parseInt(TextCodigoConvocatoria.getValue()),
                              checked:checked,
                              codigo_compromiso: rec.get('codigo_compromiso'),
                              codigo_accion: rec.get('codigo_accion')
                             },error="No se pudo cargar estado de utilizado de otras observaciones", 
                             timeout= 180000, fnCallback=false); 
        break;
  }    
}

function FunctionSuccess(resp, funcionSuccess, parametros, OtrosParametros){
  switch(funcionSuccess) {
    case "ok_1":
        if (resp['success'])
            {Ext.Msg.alert('éxito', resp['message']);}
        else
            {Ext.Msg.alert('Advertencia', resp['message']);}
        break;
        
    case "ok_2": 
        if (resp['success'])
            {Ext.Msg.alert('éxito', resp['message']);
             global_record_seleccionado_para_actualizar.set(global_nombre_fiel_del_record_para_actualizar, resp['nuevo_file_name']);
            }
        else
            {Ext.Msg.alert('Advertencia', resp['message']);}
        break;
        
    case "ok_3": 
        if (resp['success'])
            {Ext.Msg.alert('éxito', resp['message']);
             remove_record_store(StoreGridConociminetoLenguaExtranjera, global_record_seleccionado_para_actualizar);
            }
        else
            {Ext.Msg.alert('Advertencia', resp['message']);}
        break;    
  }      
}

function FunctionYesConfirmacion(yes, id, parametros){
  switch(id) {
    case "ID_confirmacion_borrar_file":
         borrar_file_del_servidor(parametros);
         break;
        
    case "ID_confirmado_borrado_file_lengua_extranjera_movilidad_nacional":            
         borrar_file_del_servidor_lengua_extranjera(parametros);
         break;
         
    case "ID_confirmado_borrado_file_lengua_extranjera_movilidad_nacional_mas_registro":
         borrar_file_lengua_extranjera_mov_nacional_mas_registro(parametros)
         break;
  }       
}

function FunctionNoConfirmacion(no, id, parametros){}

function FunctionCheckBoxChange(id, check, newValue, oldValue, eOpts){
  switch(id) {
    case "IDPreguntaCheckParticipadoComoPonente":
          if (newValue)
           {CualGrupoPonente.setDisabled(false);
            FechaDeVinculacionAspirante.setDisabled(false);
            CheckActualmenteVinculadoGrupoPonente.setDisabled(false);
           }
          else 
            {CualGrupoPonente.setDisabled(true);
             FechaDeVinculacionAspirante.setDisabled(true);
             CheckActualmenteVinculadoGrupoPonente.setDisabled(true);
            }
          CualGrupoPonente.setValue(); 
          FechaDeVinculacionAspirante.setValue();
          CheckActualmenteVinculadoGrupoPonente.setValue(false);
        break;
     
    case "IDPreguntaCheckParticipacionSemilleroInvestigacion":
          if (newValue)
           {CualGrupoSemillero.setDisabled(false);
            FechaDeVinculacionAspiranteGrupoSemillero.setDisabled(false);
            CheckActualmenteVinculadoGrupoSemillero.setDisabled(false);
           }
          else 
            {CualGrupoSemillero.setDisabled(true);
             FechaDeVinculacionAspiranteGrupoSemillero.setDisabled(true);
             CheckActualmenteVinculadoGrupoSemillero.setDisabled(true);
            }
          CualGrupoSemillero.setValue(); 
          FechaDeVinculacionAspiranteGrupoSemillero.setValue();
          CheckActualmenteVinculadoGrupoSemillero.setValue(false);
        break;    
  }         
}
