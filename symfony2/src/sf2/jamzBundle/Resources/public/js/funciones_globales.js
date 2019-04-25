function seleccionar_ruta_para_unpload_file(tipo_path){
 switch(tipo_path) {
    case 1:   
        tipo_ruta_subir_file = 1;
        quien_sube_el_archivo = 1;
        break;
       
    default:
        tipo_ruta_subir_file = 0;
 }

}


function borrar_file_del_servidor(parametros){
              
llamado_ext_ajax_request(url="URLBorrarFileUpload", parametros, msg_exito="", msg_error_trycatch="Se presentó un error",
                         msg_error_ajax= "Error ajax URLBorrarFileUpload", funcionSuccess="ok_1", OtrosParametros='',
                         id_mask="id_Mask_procesando", functionFailure="", timeout=200000, method='POST', fnCallback="",
                         target=RegionCentralConfiguracionInternacionalizacion, mostrar_mensaje_exito = false, encode_parametros=true,
                         enconde_OtrosParametros=true);
                                 
}

function borrar_file_del_servidor_lengua_extranjera(parametros){
             
var parametros_a_enviar = {codigo: parametros['codigo'],
                           ruta:global_ruta,
                           nombre_archivo: global_record_seleccionado_para_actualizar.get(global_nombre_fiel_del_record_para_actualizar),
                           codigo_postulante_seleccionado:codigo_postulante_seleccionado
                          };
                         
llamado_ext_ajax_request(url="URL_borrar_file_upload_lenguaje_extranjeroXpostulante",  parametros_a_enviar, msg_exito="Se Borro el archivo seleccionado",
                         msg_error_trycatch="Se presento un error<br>",
                         msg_error_ajax = "Se presentó un error en el llamado ajax URL_borrar_file_upload_lenguaje_extranjeroXpostulante",
                         funcionSuccess="ok_2", OtrosParametros='', id_mask="id_Mask_procesando", functionFailure="", timeout=200000,
                         method='POST', fnCallback="", target=FormularioMovilidaEstudianteNacional, mostrar_mensaje_exito = false, encode_parametros=true,
                         enconde_OtrosParametros=true);                               
}


function borrar_file_lengua_extranjera_mov_nacional_mas_registro(parametros){
             
var parametros_a_enviar = {codigo: parametros['codigo'],
                           ruta:global_ruta,
                           nombre_archivo: global_record_seleccionado_para_actualizar.get(global_nombre_fiel_del_record_para_actualizar),
                           codigo_postulante_seleccionado:codigo_postulante_seleccionado
                          };
                         
llamado_ext_ajax_request(url="URL_borrar_registro_lenguaje_extranjeroXpostulantexmovnacional",  parametros_a_enviar, msg_exito="Se Borro el registro completamente",
                         msg_error_trycatch="Se presento un error<br>",
                         msg_error_ajax = "Se presentó un error en el llamado ajax URL_borrar_registro_lenguaje_extranjeroXpostulante",
                         funcionSuccess="ok_3", OtrosParametros='', id_mask="id_Mask_procesando", functionFailure="", timeout=200000,
                         method='POST', fnCallback="", target=FormularioMovilidaEstudianteNacional, mostrar_mensaje_exito = false, encode_parametros=true,
                         enconde_OtrosParametros=true);                               
}

function retornar_record_lenguaextranjera(){
  return Ext.create('ModelConocimientoLenguaExtranjera', {
    codigo   : '',
    nombre_idioma : '',
    nombre_examen  : '',
    nivel_obtenido: '',
    nombre_archivo_adjunto: '',
    certificado:false       
});
}

function retornar_record_grupo_a_que_pertenece(){
  return Ext.create('ModelConocimientoLenguaExtranjera', {
    codigo_grupo : 0,
    nombre_grupo : '',
    pertenece_al_grupo: false,
    fecha_vinculacion: '',
    continua_actualmente_vinculado: false,
    borrar:false       
  });
}