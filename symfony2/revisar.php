<?php 

isset($validar) && isset($id_usuario) && isset($id_cliente)

$sql = 'BEGIN';
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql);
                $statement->execute();

            try {

                // SQL que ejecuta una actualizacion si el cliente ya existe
                $update_clientes = "UPDATE clientes SET id=('$id_cliente'),nombre=('$nombre_cliente'),correo=('$correo_cliente'),contrasena=('$contrasenacliente')";
                $update_usuarios = "UPDATE usaurios SET id=('$id_usuario'),nombre=('$nombre_usuario'),correo=('$email_usuario'),contrasena=('$contrasena_usuario'),genero=()";
                //var_dump($sql); exit; Se usa para depurar arrays
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql);
                $statement->execute();
                $resultado = $statement->fetchAll();

                // Generamos la ejecucion de la segunda tabla

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection2 = $doctrineManager->getConnection();
                $statement2 = $connection2->prepare($sql2);
                $statement2->execute();
                $resultado2 = $statement2->fetchAll();

            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage('error en sql'), "\n";
                $sql1 = "ROLLBACK";
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql1);
                $statement->execute();

                echo "You rolled back";
                exit;
            }
                $sql3 = "COMMIT";
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql3);
                $statement->execute();
                #creamos la consulta y la guardamos en la variable $sql para la tabla 1, y en $sql2 para la tabla 2



                ------------------------------------------------------------------------



elseif (  $id_usuario  = 0 && $id_cliente  = 0 ) {
            
            # si la variable es igual a 0 ejecute el SQL INSERT
            $sql = 'BEGIN';
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql);
                $statement->execute();


            try {

                // SQL que ejecuta una actualizacion si el cliente ya existe
               
                //var_dump($sql); exit; Se usa para depurar arrays
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql);
                $statement->execute();
                $resultado = $statement->fetchAll();

                // Generamos la ejecucion de la segunda tabla

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection2 = $doctrineManager->getConnection();
                $statement2 = $connection2->prepare($sql2);
                $statement2->execute();
                $resultado2 = $statement2->fetchAll();

                

            } catch (Exception $e) {

                echo 'Caught exception: ',  $e->getMessage('error en sql'), "\n";
                $sql1 = "ROLLBACK";
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql1);
                $statement->execute();

                echo "You rolled back";
                exit;


            }

            $sql3 = "COMMIT";
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql3);
                $statement->execute();
                #creamos la consulta y la guardamos en la variable $sql para la tabla 1, y en $sql2 para la tabla 2



                // Generamos la ejecucion segunda tabla

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection2 = $doctrineManager->getConnection();
                $statement2 = $connection2->prepare($sql2);
                $statement2->execute();
                $resultado2 = $statement2->fetchAll();        




        }





 # si ya contiene datos realizamos el UPDATE funcionando ok

    if ( $id_cliente != NULL && $id_usuario != NULL  ) {


                # si las variables contienen algo dentro! Ejecute SQL UPDATE

                $sql = 'BEGIN';

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql);
                $statement->execute();

               
            try {

                #usuarios caso de actualizar si el registro esta lleno y existe en la base de datos
                $sql2 = "UPDATE usuarios SET nombre_usuario='$nombre_usuario', apellido_usuario='$apellido_usuario',email_usuario='$email_usuario', contrasena_usuario=md5('$contrasena_usuario'), genero_usuario='$genero_usuario' WHERE id_usuario=$id_usuario ";

                                // Generamos la ejecucion segunda tabla

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection2 = $doctrineManager->getConnection();
                $statement2 = $connection2->prepare($sql2);
                $statement2->execute();
                $resultado2 = $statement2->fetchAll();
                

                #$sql2 = "INSERT INTO usuarios (nombre_usuario,apellido_usuario, email,contrasena,genero) values ('$nombre_usuario', '$apellido_usuario', '$email_usuario', '$contrasena_usuario', '$genero_usuario' )";



                #$sql = "INSERT INTO clientes (nombre,correo, contrasena) values ('$nombrecliente', '$correo_cliente', '$contrasena_cliente')";
                #$sql2 = "INSERT INTO usuarios (nombre_usuario,apellido_usuario, email,contrasena,genero) values ('$nombre_usuario', '$apellido_usuario', '$email_usuario', '$contrasena_usuario', '$genero_usuario' )";

                $sql = "UPDATE clientes SET nombre_cliente='$nombre_cliente', correo_cliente='$correo_cliente', contrasena_cliente=md5('$contrasena_cliente') WHERE id_cliente=$id_cliente ";
                $sql2 = "UPDATE usuarios SET nombre_usuario='$nombre_usuario', apellido_usuario='$apellido_usuario',email_usuario='$email_usuario', contrasena_usuario=md5('$contrasena_usuario'), genero_usuario='$genero_usuario' WHERE id_usuario=$id_usuario ";
                
                
                #var_dump($sql); exit; # Se usa para depurar arrays

                # Ejemplo de UPDATE
                //$sql="UPDATE menus SET titulo='".$_POST["titulo"]."',modulo='".$_POST["modulo"]."',icono='".$_POST["icono"]."',url='".$_POST["url"]."' WHERE id_menu=".$_POST["id_menu"];
                #var_dump($sql); exit; # Se usa para depurar arrays

                // Generamos la ejecucion de la primera tabla

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql);
                $statement->execute();
                $resultado = $statement->fetchAll();

                // Generamos la ejecucion segunda tabla

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection2 = $doctrineManager->getConnection();
                $statement2 = $connection2->prepare($sql2);
                $statement2->execute();
                $resultado2 = $statement2->fetchAll();
                

            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage('error en sql'), "\n";
                $sql1 = "ROLLBACK";
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql1);
                $statement->execute();

                echo "You rolled back";
                exit;
            }
                $sql3 = "COMMIT";
                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection = $doctrineManager->getConnection();
                $statement = $connection->prepare($sql3);
                $statement->execute();
                #creamos la consulta y la guardamos en la variable $sql para la tabla 1, y en $sql2 para la tabla 2

               
        }         

'$nombrecliente', '$correo_cliente', '$contrasena_cliente'

# try cathc funcionando con un parametro falta uno...


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

/**
 * clientes controller.
 *
 * @Route("/clientes")
 */
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
        $sql = "SELECT id, nombre, correo, contrasena FROM clientes";
        $doctrineManager = $this->getDoctrine()->getManager();                       
        $connection = $doctrineManager->getConnection();
        $statement = $connection->prepare($sql);
        $statement->execute();
        $resultado = $statement->fetchAll();
        return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action($resultado));
        
    } 

public function URLListeRegistro2Action(){
    $sql = "SELECT id, nombre_usuario, apellido_usuario, email, contrasena, genero, fecnac, idtipo FROM usuarios";


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


public function ejecutar_sql ($sql){

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection2 = $doctrineManager->getConnection();
                $statement2 = $connection2->prepare($sql);
                $statement2->execute();
                $resultado2 = $statement2->fetchAll();
                return $resultado2;
}

public function URLGuadarFormularioAction(Request $request){

    
    // Datos de la Primera tabla

    $id_usuario = $request->get('id_usuario');
    $nombre_usuario = $request->get('nombre_usuario');
    $apellido_usuario = $request->get('apellido_usuario');
    $email_usuario = $request->get('email_usuario');
    $contrasena_usuario = $request->get('contrasena_usuario');
    $genero_usuario = $request->get('genero_usuario');
    
    // datos de la segunda tabla, Clientes

    $id_cliente = $request->get('id_cliente');
    $nombre_cliente = $request->get('nombre_cliente');
    $correo_cliente = $request->get('correo_cliente');
    $contrasena_cliente = $request->get('contrasena_cliente');

    # Tarea.
    # si es diferete de nulo realize una consulta y realize sql update, si no existe realize sql insert
    try
    {
       $sql1 = "BEGIN";
       $this->ejecutar_sql($sql1);
       if ($id_cliente <> NULL && $id_cliente <> '')
        {

            $sql2 = "UPDATE clientes 
                    SET nombre_cliente='$nombre_cliente', 
                        correo_cliente='$correo_cliente', 
                        contrasena_cliente=md5('$contrasena_cliente') 
                    WHERE id_cliente= ".$id_cliente." 
                    RETURNING NOW() ";

             $r = $this->ejecutar_sql($sql2);
             
             if (sizeof($r) == 0)
                { $sql3 = "INSERT INTO clientes 
                              (nombre_cliente,correo_cliente,contrasena_cliente) 
                            values ('$nombre_cliente', '$correo_cliente', '$contrasena_cliente')";
                  $this->ejecutar_sql($sql3);
                 }

       }
       else{
            $sql3 = "INSERT INTO clientes 
                     (nombre_cliente,correo_cliente,contrasena_cliente) 
                     values ('$nombre_cliente', '$correo_cliente', '$contrasena_cliente')";
            $this->ejecutar_sql($sql3);
           }
    }catch (Exception $e){
        $sql4 = "ROLLBACK";
        $this->ejecutar_sql($sql4);
        return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action(array('success' => false, 'msg' => 'error todo mal')));
     }
    
    $sql5 = "COMMIT";
    $this->ejecutar_sql($sql5);
    // realizamos el retorno de el envio de los datos, si todo esta ok almacena en la DB.
    return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action(array('success' => true, 'msg' => 'Exito todo bien')));    
}

       


*********************************las 2 tablas funcionando ok ***********************************************************************************************
*                                                                                                                                                           *
*                                                                                                                                                           *
*                                                                                                                                                           *
*                                                                                                                                                           *
***********************************************************************************************************************************************************


public function URLListe2RegistroAction(){
        $sql = "SELECT id, nombre, correo, contrasena FROM clientes";
        $doctrineManager = $this->getDoctrine()->getManager();                       
        $connection = $doctrineManager->getConnection();
        $statement = $connection->prepare($sql);
        $statement->execute();
        $resultado = $statement->fetchAll();
        return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action($resultado));
        
    } 

public function URLListeRegistro2Action(){
    $sql = "SELECT id, nombre_usuario, apellido_usuario, email, contrasena, genero, fecnac, idtipo FROM usuarios";


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


public function ejecutar_sql ($sql){

                $doctrineManager = $this->getDoctrine()->getManager();                       
                $connection2 = $doctrineManager->getConnection();
                $statement2 = $connection2->prepare($sql);
                $statement2->execute();
                $resultado2 = $statement2->fetchAll();
                return $resultado2;
}

public function URLGuadarFormularioAction(Request $request){

    
    // Datos de la Primera tabla

    $id_usuario = $request->get('id_usuario');
    $nombre_usuario = $request->get('nombre_usuario');
    $apellido_usuario = $request->get('apellido_usuario');
    $email_usuario = $request->get('email_usuario');
    $contrasena_usuario = $request->get('contrasena_usuario');
    $genero_usuario = $request->get('genero_usuario');
    
    // datos de la segunda tabla, Clientes

    $id_cliente = $request->get('id_cliente');
    $nombre_cliente = $request->get('nombre_cliente');
    $correo_cliente = $request->get('correo_cliente');
    $contrasena_cliente = $request->get('contrasena_cliente');

    # Tarea.
    # si es diferete de nulo realize una consulta y realize sql update, si no existe realize sql insert
    try
    {
       $sql1 = "BEGIN";
       $this->ejecutar_sql($sql1);
       if ($id_usuario <> NULL && $id_usuario <> '' or $id_cliente <> NULL && $id_cliente <> '' )
        {

            $sql2 = "UPDATE usuarios 
                    SET nombre_usuario='$nombre_usuario', 
                        email_usuario='$email_usuario', 
                        contrasena_usuario=md5('$contrasena_usuario') 
                    WHERE id_usuario= ".$id_usuario." 
                        RETURNING NOW() ";

             $r = $this->ejecutar_sql($sql2);

             $sql6 = "UPDATE clientes 
                    SET nombre_cliente='$nombre_cliente', 
                        correo_cliente='$correo_cliente', 
                        contrasena_cliente=md5('$contrasena_cliente') 
                    WHERE id_cliente= ".$id_cliente." 
                    RETURNING NOW() ";

             $r = $this->ejecutar_sql($sql6);

             
             if (sizeof($r) == 0)
                { $sql3 = "INSERT INTO usuarios
                                (nombre_usuario,apellido_usuario, email_usuario,contrasena_usuario,genero_usuario) 
                            values 
                                ('$nombre_usuario', '$apellido_usuario', '$email_usuario', '$contrasena_usuario', '$genero_usuario' )";
                  $this->ejecutar_sql($sql3);

                  $sql7 = "INSERT INTO clientes 
                              (nombre_cliente,correo_cliente,contrasena_cliente) 
                            values ('$nombre_cliente', '$correo_cliente', '$contrasena_cliente')";
                  $this->ejecutar_sql($sql7);
    
                 }

       }
       else{
            $sql3 = "INSERT INTO usuarios
                                (nombre_usuario,apellido_usuario, email_usuario,contrasena_usuario,genero_usuario) 
                            values 
                                ('$nombre_usuario', '$apellido_usuario', '$email_usuario', '$contrasena_usuario', '$genero_usuario' )";

            $this->ejecutar_sql($sql3);

            $sql7 = "INSERT INTO clientes 
                     (nombre_cliente,correo_cliente,contrasena_cliente) 
                     values ('$nombre_cliente', '$correo_cliente', '$contrasena_cliente')";
            $this->ejecutar_sql($sql7);

            }
    }catch (Exception $e){
        $sql4 = "ROLLBACK";
        $this->ejecutar_sql($sql4);
        return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action(array('success' => false, 'msg' => 'error todo mal')));
     }
    
    $sql5 = "COMMIT";
    $this->ejecutar_sql($sql5);
    // realizamos el retorno de el envio de los datos, si todo esta ok almacena en la DB.
    return $this->retornar_respuesta_a_la_interfaz($this->retornarArregloEnUTF8Action(array('success' => true, 'msg' => 'Exito todo bien')));    
}

}//fin clase


}//fin clase

$sql3 = "DELETE usuarios WHERE id='".$id_usuario."' ";
                  $this->ejecutar_sql($sql3);


$sql3 = "DELETE FROM usuarios WHERE id='".$id_usuario."'";
                  $this->ejecutar_sql($sql3);

$sql7 = "DELETE FROM clientes WHERE id='".$id_cliente."'";
                  $this->ejecutar_sql($sql7);
    
                 }                  
             }

            $sql2 = "DELETE FROM usuarios WHERE id_usuario='".$id_usuario."' ";

             $r = $this->ejecutar_sql($sql2);

             $sql6 = "DELETE FROM clientes WHERE id_cliente='".$id_cliente."'";

             $r = $this->ejecutar_sql($sql6);



?> 