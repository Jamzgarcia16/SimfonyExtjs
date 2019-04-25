<?php
//03-09-2018
namespace sf2\jamzBundle\Service;
use Symfony\Component\HttpFoundation\Response;

use Doctrine\ORM\EntityManager;

/**
 * 
 * Clase para servicios varios
 * 
 * @author          Diego Alonso
 * @access          public 
 * @package         calificaciones
 * @subpackage      pago
 * @copyright       DataSae, Parte de la Familia DataCorp
 * @since           2018-03-13
 * @version         1.0
 * 
 */
class ServiceGenerales {
    protected $ServiceGenerales;
    
    /**
     * Constructor de la clase ServiceGenerales
     * 
     * @author         Diego A
     * @access         public 
     * @copyright      DataSae, Parte de la Familia DataCorp
     * @since          2015-06-30
     * @return         void
     *
     */
function __construct (EntityManager $ServiceGenerales){
 
        $this -> entityManager = $ServiceGenerales;
 }
    
public static function sacar_parametros_del_request_1($request, $todo_el_arreglo=true, $indice2="", $posicion=0, $nombre_arreglo="parametros", $decode=TRUE){
$arreglo = $request->get($nombre_arreglo);
if ($decode)
  {$array_parametros = json_decode(stripcslashes($arreglo), TRUE);}
else
  {$array_parametros = $arreglo;}

if (!$todo_el_arreglo)
  {if ($indice2 == "" || $indice2 == null)
     {return $array_parametros[$posicion];}
   else
     {return $array_parametros[$posicion][$indice2];}
  }   
else
  {return $array_parametros;}

}

public static function sacar_parametros_del_request_2($request, $todo_el_arreglo=true, $indice2="", $posicion=0, $nombre_arreglo="parametros", $decode=TRUE){
$arregloPostt = $request->request->all();

if ($decode)
  {$array_parametros = json_decode(stripcslashes($arregloPostt[$nombre_arreglo]), TRUE);}   
else
  {$array_parametros = $arregloPostt;}  

if (!$todo_el_arreglo)
  {if ($indice2 == "" || $indice2 == null)
     {return $array_parametros[$posicion];}
   else
     {return $array_parametros[$posicion][$indice2];}
  }   
else
  {return $array_parametros;}

}
    
public static function sacar_parametros_del_request_3($request, $parametro="valor0", $decode=TRUE){
$arregloPostt2 = $request->request->all();

if ($decode)
  {return json_decode(stripcslashes($arregloPostt2[$parametro]), true);}   
else
  {return stripcslashes($arregloPostt2[$parametro]);}  
}

public static function sacar_parametros_del_request_4($request, $parametro="valor0", $decode=TRUE){
$arreglo = $request->get($parametro);
if ($decode)
  {return  json_decode(stripcslashes($arreglo), TRUE);}
else
  {return  stripcslashes($arreglo);}
  
}

public static function generar_numero_aleatorio(){
 return rand(1,10000000000);     
}

public static function validar_dato($valor, $string=TRUE, $integer=TRUE, $boolean=TRUE){
if (($valor == "" || $valor == NULL) && ($string ||$integer) )
 { return "NULL";}
else if ($string)
        {return "'".$valor."'";}
     else if ($integer)
           {return $valor;} 
          else if ($boolean)
                 {if ($valor)
                    {return "TRUE";}
                  else
                    {return "FALSE";}  
                 }
               else  
                 {return "'".$valor."'";}                    
}   

public static function retornarArregloEnUTF8Action($array) {
        $array_salida = array();

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $value = self::retornarArregloEnUTF8Action($value);
            } else {
                if (!mb_detect_encoding($value, 'UTF-8', true)) {
                    $value = utf8_encode($value);
                }
            }

            $array_salida[$key] = $value;
        }

        return $array_salida;
 }
 
public static function retornar_respuesta_a_la_interfaz ($results){
$response = new  Response();
$response->setContent(json_encode($results));
$response->headers->set('Content-Type','text/plain');
return $response;
} 

public static function validar_codificacion($string, $encode=true, $decode=false, $forzar_encode_utf8= false, $forzar_decode=false){
 if ($forzar_encode_utf8)
    {return utf8_encode($string);}
    
 if ($forzar_decode) 
    {return utf8_decode($string);}
    
 
 if (!mb_detect_encoding($string, 'UTF-8', true))
     {if ($encode)
         {//print_r("1"); exit; 
          return utf8_encode($string);
         }
      else 
         {//print_r("2"); exit; 
          return $string;
         } 
      }     
 else if ($decode)
        {//print_r("3"); exit; 
         return utf8_decode($string);
        }
     else
        { //print_r("4"); exit; 
         return $string;
        }
}

public static function remplazar_en_cadena($cadena, $buscar, $remplazar){
return str_replace($buscar, $remplazar, $cadena);
}


public static function URLUploadFilePostulanteGenerico($ruta, $tamanio_max, $siguiente_consecutivo, $request){
$file = $request->files->get('name_IDfileUploadFilePostulanteInternacionalizacion');

if ($ruta == "" || $ruta == NULL)
 {$array = array('success' => false, 'message' => 'Ruta final del archivo no esta configurada!');
  return new Response(json_encode($array));            
 }
$ruta_final = ServiceGenerales::crear_ruta_completa_para_file_upload($ruta);
ServiceGenerales::crear_directorio_upload($ruta_final);
if (!isset($file))
   {return new Response(json_encode(array('success' => false, 'message' => 'No se puede procesar el archivo!')));}            
else 
   {$response = ServiceGenerales::UnploadFileServer($ruta_final, $tamanio_max, $siguiente_consecutivo);   
    return new Response(json_encode($response));
   }   
}

public static function UnploadFileServer($path, $tamanio_max, $siguiente_consecutivo){

sleep(2);
$file = $_FILES['name_IDfileUploadFilePostulanteInternacionalizacion'];
$fileName = $file['name'];
$fileSize = round(($file['size'] / 1024) * 100) / 100; //en KB
$fileNameServer = $file['tmp_name'];
$fileError = $file['error'];  

if ($fileError > 0) 
    {return array("success" => false,
                  "message" => ServiceGenerales::FileUploadErrorMsg($fileError)
                 );
    }
else 
    {$error_ext_size = ServiceGenerales::ValidarSizeFileUpload($fileSize, $tamanio_max);
     $ext_file = ServiceGenerales::sacar_extesion_upload($fileName) ;
     
     
     if ($error_ext_size <> "") 
           { ServiceGenerales::DeleteFileUploadServer($fileNameServer);
             return array("success" => false,
                          "message" => $error_ext_size
                         ); 
           }
     else if ($ext_file == "" || $ext_file == NULL)
             {ServiceGenerales::DeleteFileUploadServer($fileNameServer);
             return array("success" => false,
                          "message" => "Archivo sin extensión."
                         ); 
             }
          else if (is_uploaded_file($fileNameServer))
                  {                    
                    $filenamefinal = ServiceGenerales::crear_nombre_archivo_final($ext_file, $siguiente_consecutivo); 
                    $path_completo = $path.$filenamefinal;
                   
                    ServiceGenerales::mover_archivo_upload($fileNameServer, $path_completo);
                                
                    if(!is_file($path_completo))   
                       {return array("success" => false,
                                     "message" => "Se presento un error al intentar mover el archivo a la ubicación final"
                                    );
                       }
                    else
                       {return array("success" => true,
                                     "message" => 'Se subio correctamente el archivo', 
                                     "file_tmp" => $filenamefinal,
                                     "path"=>$path_completo
                                    );
                       }
                  }
               else
                 {return array("success" => false,
                               "message" => "El archivo no subio al servidor"
                              );             
                 }       
    }    
 
}

public static function FileUploadErrorMsg($error_code) {
    switch ($error_code) { 
        case UPLOAD_ERR_INI_SIZE: 
            return "El archivo es más grande que lo permitido por el Servidor."; 
        case UPLOAD_ERR_FORM_SIZE: 
            return "El archivo subido es demasiado grande."; 
        case UPLOAD_ERR_PARTIAL: 
            return "El archivo subido no se terminó de cargar (probablemente cancelado por el usuario)."; 
        case UPLOAD_ERR_NO_FILE: 
            return "No se subió ningún archivo"; 
        case UPLOAD_ERR_NO_TMP_DIR: 
            return "Error del servidor: Falta el directorio temporal."; 
        case UPLOAD_ERR_CANT_WRITE: 
            return "Error del servidor: Error de escritura en disco"; 
        case UPLOAD_ERR_EXTENSION: 
            return "Error del servidor: Subida detenida por la extención";
      default: 
            return "Error del servidor: ".$error_code; 
     } 
}

public static function sacar_extesion_upload($archivo){
  $array_extension = explode(".", $archivo);   
  if (sizeof($array_extension) > 1)
     {$ultimo = count($array_extension) - 1;
      $extension = "." . $array_extension[$ultimo];    
     }
  else {$extension = "";}
  
 return $extension;   
}

public static function ValidarSizeFileUpload($size,$tamanio_max){
$tamano_permitido = $tamanio_max;

if ($tamano_permitido == "" || $tamano_permitido == NULL)
   {$tamano_permitido = 5000;}

if ($size > (int)$tamano_permitido)
    {return "Recuerde El tamaño máximo es de : ".$tamano_permitido." Kbytes";}
else
    {return "";}      
}

public static function DeleteFileUploadServer($path){
    if(is_file($path))    
       {unlink($path);}
}

public static function mover_archivo_upload($fileNameServer, $nuevo_nombre){
 move_uploaded_file($fileNameServer,$nuevo_nombre);   
}

public static function existe_archivo_en_ruta($path){
if (file_exists($path)) {
    return true;
} else {
    return false;
 }    
}

public static function crear_directorio_upload($ruta){
   if (!is_dir($ruta)) {
            mkdir($ruta);
        }     
}

public static function crear_nombre_archivo_final($extension, $siguiente_consecutivo){
$codigo = $siguiente_consecutivo;

if ($codigo == "" || $codigo == NULL)
  {return "";}
else
  {return "file_".$codigo.$extension;}   
}

public static function crear_ruta_completa_para_file_upload($partefinal){
    return __DIR__."/../../../../web".$partefinal;
}



public static function descargar_archivo_para_todo_tipo_de_archivo ($full_path, $name_file){
$file = basename($name_file);
$path = $full_path.$file;
$type = '';  

if (is_file($path)) 
  {$size = filesize($path);
   if ($type == '') 
      {$type = "application/force-download";}
        // Definir headers
                        
          header("Content-Description: File Transfer"); 
          header("Pragma: public");
          header("Expires: 0");
          header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
          header("Cache-Control: private",false); 
          header("Content-Type: $type");
          header("Content-disposition: attachment; filename=\"$file\"");
          header("Content-Transfer-Encoding: binary");
          header("Content-Length: ".$size);

        // Descargar archivo          
          readfile($path);
        return 0;
  }  
else 
 {return 1;}                      
}

}
