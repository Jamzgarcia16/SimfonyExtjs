<?php

use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\RequestContext;

/**
 * appProdUrlMatcher
 *
 * This class has been auto-generated
 * by the Symfony Routing Component.
 */
class appProdUrlMatcher extends Symfony\Bundle\FrameworkBundle\Routing\RedirectableUrlMatcher
{
    /**
     * Constructor.
     */
    public function __construct(RequestContext $context)
    {
        $this->context = $context;
    }

    public function match($pathinfo)
    {
        $allow = array();
        $pathinfo = rawurldecode($pathinfo);

        if (0 === strpos($pathinfo, '/URL')) {
            if (0 === strpos($pathinfo, '/URLP')) {
                // sf2jamz_URLPrueba
                if ($pathinfo === '/URLParking') {
                    return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\DefaultController::URLParkingAction',  '_route' => 'sf2jamz_URLPrueba',);
                }

                // sf2jamz_URLPrueba2
                if ($pathinfo === '/URLPrueba2') {
                    return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\clientesController::URLPrueba2Action',  '_route' => 'sf2jamz_URLPrueba2',);
                }

            }

            if (0 === strpos($pathinfo, '/URLListe')) {
                // sf2jamz_URLListe2Registro
                if ($pathinfo === '/URLListe2Registro') {
                    return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\clientesController::URLListe2RegistroAction',  '_route' => 'sf2jamz_URLListe2Registro',);
                }

                // sf2jamz_URLListeRegistro2
                if ($pathinfo === '/URLListeRegistro2') {
                    return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\clientesController::URLListeRegistro2Action',  '_route' => 'sf2jamz_URLListeRegistro2',);
                }

            }

            // sf2jamz_URLURLGuadarFormulario
            if ($pathinfo === '/URLGuadarFormulario') {
                return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\clientesController::URLGuadarFormularioAction',  '_route' => 'sf2jamz_URLURLGuadarFormulario',);
            }

            // sf2jamz_URLURLform_parqueadero
            if ($pathinfo === '/URLform_parqueadero') {
                return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\DefaultController::URLform_parqueaderoAction',  '_route' => 'sf2jamz_URLURLform_parqueadero',);
            }

            // sf2jamz_URLURLFormularioParqueadero
            if ($pathinfo === '/URLFormularioParqueadero') {
                return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\DefaultController::URLFormularioParqueaderoAction',  '_route' => 'sf2jamz_URLURLFormularioParqueadero',);
            }

            // sf2jamz_URLtraer_datos_1
            if ($pathinfo === '/URLtraer_datos_1') {
                return array (  '_controller' => 'sf2\\jamzBundle\\Controller\\DefaultController::URLtraer_datos_1Action',  '_route' => 'sf2jamz_URLtraer_datos_1',);
            }

        }

        throw 0 < count($allow) ? new MethodNotAllowedException(array_unique($allow)) : new ResourceNotFoundException();
    }
}
