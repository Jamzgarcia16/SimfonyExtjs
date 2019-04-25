Ext.define('ModelPruebaCombo', {
     extend: 'Ext.data.Model',
     idProperty: 'IDModelPruebaCombo ',
     fields: [{name: 'id', type: 'integer'},
             {name: 'nombre', type: 'string'},
             {name: 'correo', type: 'string'},
             {name: 'contrasena', type: 'string'}]

});

Ext.define('ModelPruebaCombo2', {
     extend: 'Ext.data.Model',
     idProperty: 'IDModelPruebaCombo2 ',
     fields: [{name: 'id', type: 'integer'},
             {name: 'nombre_usuario', type: 'string'},
             {name: 'apellido_usuario', type: 'string'},
             {name: 'email', type: 'string'},
             {name: 'contrasena', type: 'string'},
             {name: 'genero', type: 'string'},
             ]

});

Ext.define('ModelListaTablaTipoDeCobro', {
     extend: 'Ext.data.Model',
     idProperty: 'IDModelListaGenero',
     fields: [{name: 'ano', type: 'string'},
              {name: 'nombre_tipo_cobro', type: 'string'},
              {name: 'cod_tipo_cobro', type: 'integer'}]
        });



