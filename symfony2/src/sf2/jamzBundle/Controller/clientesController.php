<?php

namespace sf2\jamzBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;  
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use sf2\jamzBundle\Entity\clientes;
use sf2\jamzBundle\Form\clientesType;
use sf2\jamzBundle\Service\ServiceGenerales AS SerGen;
use sf2\jamzBundle\Controller\SQLDefaultController AS SQLDefault;

/**
 * clientes controller.
 *
 * @Route("/clientes")
 */

#propiedades de la clase son las variables
  #metodos de la clase son las funciones
class clientesController extends Controller
{

    /**
     * Lists all clientes entities.
     *
     * @Route("/", name="clientes")
     * @Method("GET")
     * @Template()
     */

    public function URLPruebaAction(){
        return $this->render('sf2jamzBundle:clientes:layout.html.twig', array('aleatorio' => $this->generar_numero_aleatorio() )
                            );
    }

    public function URLPrueba2Action(){
        return $this->render('sf2jamzBundle:clientes:show.html.twig', array('aleatorio' => $this->generar_numero_aleatorio() )
                            );// vista de prueba funcionando ok
    } 

   public function URLListe2RegistroAction(){

        $sql = "SELECT id, nombre, correo, contrasena,numero1,numero2,resultado FROM clientes"; # enviarlo al SQLDefault.
        $doctrineManager = $this->getDoctrine()->getManager(); 
        $connection = $doctrineManager->getConnection();
        $statement = $connection->prepare($sql);
        $statement->execute();
        $resultado = $statement->fetchAll();
        return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action($resultado));
        
    } 

public function URLListeRegistro2Action(){
    $sql = "SELECT id, nombre_usuario, apellido_usuario, email, contrasena, genero, fecnac, idtipo FROM usuarios"; # enviarlo al SQLDefault.


    $doctrineManager = $this->getDoctrine()->getManager();                       
    $connection = $doctrineManager->getConnection();
    $statement = $connection->prepare($sql);
    $statement->execute();
    $resultado = $statement->fetchAll();
    return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action($resultado));
    
    }    

public function retornar_respuesta_a_la_interfaz ($results){
    $response = new  Response();
    $response->setContent(json_encode($results));
    $response->headers->set('Content-Type','text/plain');
    
    return $response;
} 

public function retornarArregloEnUTF8Action($array) {
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

public function generar_numero_aleatorio(){
 return rand(1,10000000000);     
}
public function ejecutar_SQLs_devuelve_arregloAction($sql, $parametros, $case){
if ($sql == "" || $sql == NULL)
    {return array();}
else{  
     $doctrineManager = $this->getDoctrine()->getManager();                    
     $connection = $doctrineManager->getConnection();
     $statement = $connection->prepare($sql);
        
     if ($case <> NULL && $case <> "")
        {return SerGen::retornarArregloEnUTF8Action(SQLPreparar::bindValue_sql($sql, $statement, $parametros, $case));}
     else
        {$statement->execute();
         return SerGen::retornarArregloEnUTF8Action($statement->fetchAll());
        }
    } 
}           
            
public function ejecutar_SQLs_devuelve_un_valorAction($sql, $index_column="", $index_fila=0, $parametros="", $case=""){
  
if ($sql == "" || $sql == NULL)
    {return "";}
else
  {      
    $doctrineManager = $this->getDoctrine()->getManager();                     
    $connection = $doctrineManager->getConnection();
    $statement = $connection->prepare($sql);
       
    if ($case <> NULL && $case <> "")
       {$resultado = SerGen::retornarArregloEnUTF8Action(SQLPreparar::bindValue_sql($sql, $statement, $parametros, $case));}
    else
       {$statement->execute();
        $resultado = $statement->fetchAll();
       }
      
       
    if (sizeof($resultado) == 0)
        {return "";}
    else
        {return $resultado[$index_fila][$index_column];}
  }
  
}
public function buscar_ano_actual(){
     return  date('Y');
  }

public function ejecutar_SQL($sql, $arreglo = true, $indexcolumna = "", $indexfila = 0, $array_data_parametros=array(), $numero_case=NULL){ 
  if ($arreglo) 
     {return $this->ejecutar_SQLs_devuelve_arregloAction($sql, $array_data_parametros, $numero_case);}
  else
     {return $this->ejecutar_SQLs_devuelve_un_valorAction($sql, $indexcolumna, $indexfila, $array_data_parametros, $numero_case);} 
}
    
public function SQL_inicio_transaccion(){
  $this->SQL_inicio_transaccion("BEGIN"); 
}

public function SQL_fin_transaccion_exitosa(){
  $this->ejecutar_SQL("COMMIT"); 
}

public function SQL_fin_transaccion_erronea(){
  $this->ejecutar_SQL("ROLLBACK"); 
}



public function URLGuadarFormularioAction(Request $request){

$parametros_formulario = $request->request;
#var_dump($parametros_formulario); exit;
    
    # inicializamos las variables tipo float en 0.0
    $valor_venta = 0.0;
    $iva = 0.0;
    $precio_venta = 0.0;
    $potencia = 0;

    $cliente = array( # datos de la tabla clientes
    'cc_cliente' => $request->get('name_idtext_cc_cliente'),
    'nombre_cliente' => $request->get('name_idtext_nombre_cliente'),
    'correo_cliente' => $request->get('name_idtext_correo_cliente'),
    'pwd' => $request->get('name_idtext_contrasena'),
    'num_1' => $request->get('name_idtext_num_1'),
    'num_2' => $request->get('name_idtext_num_2'),
    'valor_venta' => $request->get('name_idtext_valor_venta'),
    'numero_p' => $request->get('name_idtext_numero_p'),
    'base' => $request->get('name_idtext_base')   
    
     );

  $numero_p = $cliente["numero_p"]; 
  #var_dump($numero_p); exit;
  $base = $cliente["base"]; 
  #var_dump($base); exit;

  $potencia = pow($numero_p, $base); 
  #var_dump($potencia); exit;

  $cc_cliente = $cliente["cc_cliente"]; 
  #var_dump($cc_cliente); exit;

  /* Algoritmo Operaciones Basicas */
  $numero1 = $cliente["num_1"];
  #var_dump($numero1); exit;
  $numero2 = $cliente["num_2"];
  #var_dump($numero2); exit;

  /* Algoritmo IVA y Precio de venta mas IVA */
  $valor_venta = $cliente["valor_venta"];
  #var_dump($valor_venta); exit;

  $valor_venta;

  $float_valor_venta = floatval($valor_venta); /*  funcion para convertir de string a float   */
  #var_dump($float_valor_venta); exit;

  $iva = $float_valor_venta * 0.19;
  #var_dump($iva); exit;
  $precio_venta = $float_valor_venta + $iva;
  #var_dump($precio_venta); exit;

  $resultado = $numero1 + $numero2;
  #var_dump($resultado); exit;
  $resultado2 = $numero1*$numero2;

  $cc_cliente = $cliente["cc_cliente"];

  #var_dump($cliente); exit;

    $sql = SQLDefault::buscar_cod_cliente($cc_cliente);
    #var_dump($sql); exit;     # cod cliente

    # validamos si el codigo del cliente existe
    $codigo_cliente = $this->ejecutar_SQLs_devuelve_un_valorAction($sql, "cod_cliente");
    #var_dump($codigo_cliente); exit;

    # Tarea.
    # si es diferete de nulo realize una consulta y realize sql update, si no existe realize sql insert.
    # 15/04/2019 Tarea completada ok
    try
    {
   #$begin = "BEGIN";
   #$begin = $this->SQL_inicio_transaccion();
    if ($codigo_cliente == "") {

    # funcion intval convierte un string a int 
    $cc_cliente = intval($cc_cliente);
    #var_dump($cc_cliente); exit;

    
    # evaluamos el tipo de variable
    //echo "\$cc_cliente==$cc_cliente; tipo : " . gettype ($cc_cliente) . "<br />\n";
    
    $sql2 = SQLDefault::SQL_crear_cliente($cliente);
    #var_dump($sql2); exit;

    # si el codigo del cliente es vacio creamos un nuevo cliente
    
    $new_cod_cliente = $this->ejecutar_SQLs_devuelve_un_valorAction($sql2, "cod_cliente");
    
    #var_dump($new_cod_cliente); exit;
    
   }else{

    # cedula del cliente
    $cc_cliente = intval($cc_cliente);
    #var_dump($cc_cliente); exit;

    $sql = SQLDefault::buscar_cod_cliente($cc_cliente);
    #var_dump($sql); exit;     # cod cliente

    # validamos si el codigo del cliente existe
    $codigo_cliente = $this->ejecutar_SQLs_devuelve_un_valorAction($sql, "cod_cliente");
    # obtenemos el codigo del cliente       
    #var_dump($codigo_cliente); exit;

    # se almacena el valor de la suma realizada al inicio del programa
    $resultado; # variable resultado con valor de la suma cargado ok
    #var_dump($resultado); exit;

    $resultado2; # variable resultado2 con valor de la multiplicacion cargado ok
    #var_dump($resultado2); exit;

    $float_valor_venta;
    #var_dump($float_valor_venta); exit;
    $iva;
    #var_dump($iva); exit;
    $precio_venta;
    #var_dump($precio_venta); exit;

    intval($numero_p);
    $base;    
    $potencia;
    #var_dump($potencia); exit;

    $sql2 = SQLDefault::SQL_actualizar_cliente($cliente,$cc_cliente,$codigo_cliente,$resultado,$resultado2,$float_valor_venta,$iva,$precio_venta,$numero_p,$base,$potencia);  
    #var_dump($sql2); exit;
    $act_cliente = $this->ejecutar_SQL($sql2);
    #var_dump($act_cliente); exit;
    $resultado;
    #var_dump($resultado); exit;
    $resultado2;
    #var_dump($resultado2); exit;
    $float_valor_venta;
    #var_dump($float_valor_venta); exit;
    $iva;
    #var_dump($iva); exit;
    $precio_venta;
    #var_dump($precio_venta); exit;

    $potencia;
    #var_dump($potencia); exit;

    #$error = " variable  $$cliente vacia!!  ";
    #var_dump($error); exit;
    } 

      
    }catch (Exception $e){
        #$sql4 = "ROLLBACK";
        #$this->ejecutar_SQL($sql4);
        return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action(array('success' => false, 'msg' => 'error todo mal')));
     }
    
    #$sql5 = "COMMIT";
    #$this->ejecutar_SQL($sql5);
    // realizamos el retorno de el envio de los datos, si todo esta ok almacena en la DB.
    return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action(array('success' => true, 'msg' => 'Exito todo bien')));    
}

}//fin clase