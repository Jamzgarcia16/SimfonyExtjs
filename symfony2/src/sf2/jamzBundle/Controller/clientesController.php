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
    'base' => $request->get('name_idtext_base'),
    'numero_inverso' => $request->get('name_idtext_numero_inverso')
     );

    /* Algoritmo Simulador de Credito */
    $credito = array ( 
    'capital' => $request->get('name_idttext_capital'),
    'tasa' => $request->get('name_idtext_tasa_de_interes'),
    'tiempo_credito' => $request->get('name_idtext_tiempo')
     );

    $capital = 0.0;
    $tasa = 0.0;
    $tiempo_credito = 0 ;
    $interes = 0.0;
    $monto = 0.0;
    $numero_mayor = 0;
    $resultado_entero = 0;
    $resultado_multiplo = 0;
    // Entrada de Datos
    $capital = $credito["capital"]; 
    #var_dump($capital); exit;
    $tasa = $credito["tasa"]; 
    #var_dump($tasa); exit;
    $tiempo_credito = $credito["tiempo_credito"]; 
    #var_dump($tiempo_credito); exit;

    //Proceso
    $monto = pow((1 + $tasa / 100), $tiempo_credito) * $capital;
    #var_dump($monto); exit;
    $interes = $monto - $capital;
    #var_dump($interes); exit;

    #var_dump($credito); exit;

    $resultado_credito = array(
        'monto' => $monto,
        'interes' => $interes
    );
    #var_dump($resultado_credito); exit;

     ################################### FIN ALGORITMO SIMULADOR DE CREDITO #########################################################################



    /* Algoritmo Potencia de un numero */  
    $numero_p = $cliente["numero_p"]; 
    #var_dump($numero_p); exit;
    $base = $cliente["base"]; 
    #var_dump($base); exit;

    $potencia = pow($numero_p, $base); 
    #var_dump($potencia); exit;

    /* Algoritmo Numero Inverso  */
    $n = $cliente["numero_inverso"];
    #var_dump($n); exit;  

    $tmp = $n;
    #var_dump($tmp); exit;
    $r = $n % 10;
    #var_dump($r); exit;
    $n = (int)($n / 10);
    #var_dump($n); exit;
    $ni = $r * 10;
    #var_dump($ni); exit;

    $r = $n % 10;
    #var_dump($r); exit;
    $n = (int)($n / 10);
    #var_dump($n); exit;
    $ni = ($ni + $r) * 10;
    #var_dump($ni); exit;

    $r = $n % 10;
    #var_dump($r); exit;
    $n = (int)($n / 10);
    #var_dump($n); exit;
    $ni = ($ni + $r) * 10;
    #var_dump($ni); exit;

    $r = $n % 10;
    #var_dump($r); exit;
    $n = (int)($n / 10);
    #var_dump($n); exit;
    $ni = ($ni + $r) * 10;
    #var_dump($ni); exit;

    $r = $n % 10;
    #var_dump($r); exit;
    $n = (int)($n / 10);
    #var_dump($n); exit;
    $ni = ($ni + $r) * 10;
    #var_dump($ni); exit;

    $ni = $ni + $n;
    #var_dump($ni); exit;
    $n = $tmp;
    #var_dump($n); exit;
    ################################### FIN ALGORITMO NUMERO INVERSO #########################################################################

    $cc_cliente = $cliente["cc_cliente"]; 
    #var_dump($cc_cliente); exit;

    /* Algoritmo Operaciones Basicas */
    $numero1 = $cliente["num_1"];
    #var_dump($numero1); exit;
    $numero2 = $cliente["num_2"];
    #var_dump($numero2); exit;

    ##########################################################

    if ($numero1>$numero2) {
        $numero_mayor = $numero1;
    }else{
        $numero_mayor = $numero2;
    }
    #var_dump($numero_mayor); exit;

    ###########################################################

    if ($numero1 == 0) 
    {
        $resultado_entero = "NEUTRO";
    }

    if ($numero1 < 0) 
    {
        $resultado_entero = "NEGATIVO";
    }

    if($numero1 > 0) 
    {
        $resultado_entero = "POSITIVO";
    }
    #var_dump($resultado_entero); exit;
    # no se guarda en base de datos
    #############################################################

    if ($numero1 % 3 == 0 && $numero1 % 5 == 0) {
        $resultado_multiplo = "Si es multiplo de 3 y 5";
    }else{
        $resultado_multiplo = "No es multiplo de 3 y 5";
    }
    #var_dump($resultado_multiplo); exit;
    # no se guarda en base de datos
    ###############################################################
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
    #var_dump($cc_cliente); exit;

    #var_dump($cliente); exit;

    ###############################################################
    #                                                              #
    #                                                              #
    # aqui vamos a hacer el ejercicio del restaurante, vas a crear #
    # una tabla nueva, un nuevo insert update de esta tabla y todo  
    # el algoritmo para poder ejecutarlo, tambien colocar resultados
    # para mostrar los resultados obtenidos.                       #
    # 29/04/2019 Jimmy Cantor.                                     #
    # Programacion Perchita! #                                                              #
    ################################################################


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

    $sql3 = SQLDefault::SQL_crear_simulador_credito($credito,$resultado_credito,$new_cod_cliente,$cc_cliente);
    #var_dump($sql3); exit;
    $this->ejecutar_SQL($sql3);    
    
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

    $sql2 = SQLDefault::buscar_cod_cliente_credito($cc_cliente);
    #var_dump($sql2); exit;     # cod cliente

    $cod_cliente_credito = $this->ejecutar_SQLs_devuelve_un_valorAction($sql2, "cliente_cod");
    #var_dump($cod_cliente_credito); exit;
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
    #var_dump($numero_p); exit;
    $base;    
    #var_dump($base); exit;
    $potencia;
    #var_dump($potencia); exit;

    # valor de numero inverso
    $n;
    #var_dump($n); exit;

    $numero_mayor;

    $sql3 = SQLDefault::SQL_actualizar_cliente($cliente,$cc_cliente,$codigo_cliente,$resultado,$resultado2,$float_valor_venta,$iva,$precio_venta,$numero_p,$base,$potencia,$n,$numero_mayor);  
    #var_dump($sql3); exit;
    $act_cliente = $this->ejecutar_SQL($sql3);
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

    $n;
    #var_dump($n); exit;
    $cod_cliente_credito;
    #var_dump($cod_cliente_credito); exit;

    $sql4 = SQLDefault::SQL_actualizar_credito($credito,$resultado_credito,$cod_cliente_credito,$cc_cliente);  
    #var_dump($sql4); exit;
    $act_credito = $this->ejecutar_SQL($sql4);
    #var_dump($act_credito); exit;

    $fila = $act_credito[0];
    #var_dump($fila); exit;
    $new_cod_cliente_credito = $fila["cliente_cod"];
    #var_dump($new_cod_cliente_credito); exit;

    $sql5 = SQLDefault::SQL_facturar_cliente_por_credito($new_cod_cliente_credito);
    #var_dump($sql5); exit;
    $this->ejecutar_SQL($sql4);    
    

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