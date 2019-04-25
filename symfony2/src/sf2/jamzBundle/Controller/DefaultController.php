<?php

namespace sf2\jamzBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;  
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use sf2\jamzBundle\Service\ServiceGenerales AS SerGen;
use sf2\jamzBundle\Controller\SQLDefaultController AS SQLDefault;

class DefaultController extends Controller
{
	public function URLParkingAction(){
	return $this->render('sf2jamzBundle:Default:index.html.twig', array('aleatorio' => $this->generar_numero_aleatorio()));
	}

	public function URLform_parqueaderoAction(){
	        return $this->render('sf2jamzBundle:Default:vista_parquedaero.html.twig', array('aleatorio' => $this->generar_numero_aleatorio() )
	                            );// vista de prueba funcionando ok
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

	public function buscar_ano_actual(){
	   return  date('Y');
	}




	/* funcion para almacenar datos en la aplicacion parqueadero  */ 
    public function URLFormularioParqueaderoAction(Request $request){
    	/* Declaramos las propiedades internas de la funcion Guardar Formulario Parqueadero */

    $ano_actual = $this->buscar_ano_actual();
    #var_dump($ano_actual); exit;   
	
	}# fin funcion datos parqueadero

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

	public function ejecutar_SQL($sql, $arreglo = true, $indexcolumna = "", $indexfila = 0, $array_data_parametros=array(), $numero_case=NULL)
	{ 
	  if ($arreglo) 
	     {
	     	return $this->ejecutar_SQLs_devuelve_arregloAction($sql, $array_data_parametros, $numero_case);
	     }
	  else
	     {
	     	return $this->ejecutar_SQLs_devuelve_un_valorAction($sql, $indexcolumna, $indexfila, $array_data_parametros, $numero_case);
	     } 
	}
    
	public function SQL_inicio_transaccion(){
	  $this->ejecutar_SQL("BEGIN"); 
	}

	public function SQL_fin_transaccion_exitosa(){
	  $this->ejecutar_SQL("COMMIT"); 
	}

	public function SQL_fin_transaccion_erronea(){
	  $this->ejecutar_SQL("ROLLBACK"); 
	}
		
}# fin clase