<?php
namespace sf2\jamzBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class SQLDefaultController extends Controller
{

  # Case Delete from tables Clientes and Usuarios

  public static function SQL_eliminar_usuario($id_usuario){
  $sql = "DELETE FROM usuarios WHERE id_usuario='".$id_usuario."' ";
  return $sql;
  }
  public static function SQL_eliminar_cliente($id_cliente){
  $sql = "DELETE FROM clientes WHERE id_cliente='".$id_cliente."' ";
  return $sql;
  }  


   # esta funcion busca con la cedula del cliente el codigo del mismo. 
  public static function buscar_cod_cliente($documento){
  $sql="SELECT cod_cliente FROM clientes WHERE cc_cliente = '".$documento."' ";

  return $sql;
}
  public static function buscar_cod_cliente_credito($documento){
  $sql="SELECT cliente_cod FROM simulador_credito WHERE cc_cliente = '".$documento."' ";

  return $sql;
}



public static function SQL_crear_cliente($parametros){
    $sql ="
    INSERT INTO clientes 
    (  
       nombre_cliente, 
       correo_cliente,
       pass,
       numero1,
       numero2,
       cc_cliente,
       fecha_modificacion  
       ) 
    VALUES 
      (
      '".$parametros["nombre_cliente"]."',
      '".$parametros["correo_cliente"]."',
      '".md5($parametros["pwd"])."',
      ".$parametros["num_1"].",
      ".$parametros["num_2"].",
      ".$parametros["cc_cliente"].",
      now()
    )
    RETURNING cod_cliente ";
    return $sql;  
}

public static function SQL_crear_simulador_credito($parametros_credito,$resultado_credito,$new_cod_cliente,$cc_cliente){
    $sql ="
    INSERT INTO simulador_credito 
    (  
       capital, 
       tasa_de_interes,
       tiempo,
       interes,
       monto,
       cliente_cod,
       cc_cliente
       ) 
    VALUES 
      (
      '".$parametros_credito["capital"]."',
      '".$parametros_credito["tasa"]."',
      ".$parametros_credito["tiempo_credito"].",
      ".$resultado_credito["monto"].",
      ".$resultado_credito["interes"].",
      $new_cod_cliente,
      $cc_cliente


    )";
    return $sql;  
}





public static function SQL_actualizar_cliente($parametros,$cc_client,$cod_client,$result,$result2,$valor_venta,$iva,$precio_venta,$numero_p,$base,$potencia,$inverso){
$sql=" 
UPDATE clientes
SET
nombre_cliente = '".$parametros["nombre_cliente"]."',
correo_cliente = '".$parametros["correo_cliente"]."',
pass = '".md5($parametros["pwd"])."',
numero1 =  ".$parametros["num_1"].",
numero2 = ".$parametros["num_2"].",
resultado = $result,
cod_cliente = $cod_client,
cc_cliente = $cc_client,
resultado2 = $result2,
valor_venta = $valor_venta,
iva = $iva,
precio_venta = $precio_venta,
numero_p = $numero_p,
base = $base,
potencia = $potencia,
numero_inverso = $inverso
WHERE
cc_cliente =  '".$cc_client."' RETURNING cod_cliente, resultado,resultado2,valor_venta,iva,precio_venta,numero_p,base,potencia,numero_inverso";
  return $sql;
}

public static function SQL_actualizar_credito($parametros_credito,$resultado_credito,$cod_client,$cc_cliente){
$sql=" 
UPDATE simulador_credito
SET
capital = ".$parametros_credito["capital"].",
tasa_de_interes = ".$parametros_credito["tasa"].",
tiempo = ".$parametros_credito["tiempo_credito"].",
interes = ".$resultado_credito["interes"].",
monto = ".$resultado_credito["monto"]." ,
cliente_cod = $cod_client,
cc_cliente = $cc_cliente
WHERE
cc_cliente =  '".$cc_cliente."' RETURNING cliente_cod,cc_cliente,monto,interes ";
  return $sql;
}

public static function SQL_facturar_cliente_por_credito($codigo_cliente_credito){
$sql="SELECT nombre_cliente,correo_cliente,cod_cliente,capital,tasa_de_interes,tiempo,monto from clientes c LEFT JOIN simulador_credito sc ON c.cod_cliente=sc.cliente_cod WHERE cliente_cod=$codigo_cliente_credito";
return $sql;
  }

public static function SQL_listar_categoria(){

  }  

public static function SQL_insert_usuario($user){
  $sql = "INSERT INTO 
              usuarios
                      (
                      nombre_usuario,
                      apellido_usuario, 
                      email_usuario,
                      contrasena_usuario,
                      genero_usuario
                      )
                      values 
                      (
                      '".$user["nombre_usuario"]."',
                       '".$user["apellido_usuario"]."',
                       '".$user["email_usuario"]."',
                       '".$user["contrasena_usuario"]."', 
                       '".$user["genero_usuario"]."' 
                     )RETURNING id_usuario";
  return $sql;
  }

  public static function SQL_insert_cliente($client){
  $sql = "INSERT INTO 
              clientes
                      (
                     nombre_cliente,
                     correo_cliente,
                     contrasena_cliente
                      )
                      values 
                      (
                      '".$client["nombre_cliente"]."',
                      '".$client["correo_cliente"]."',
                      '".$client["contrasena_cliente"]."'
                     )
                     RETURNING id_cliente";
  return $sql;
  }

}

