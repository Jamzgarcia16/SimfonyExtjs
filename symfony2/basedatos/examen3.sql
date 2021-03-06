PGDMP                         w            examen    11.2    11.2 A    Q           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            R           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            S           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            T           1262    16393    examen    DATABASE     �   CREATE DATABASE examen WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Spanish_Colombia.1252' LC_CTYPE = 'Spanish_Colombia.1252';
    DROP DATABASE examen;
             postgres    false            �            1259    24586    clientes    TABLE     �  CREATE TABLE public.clientes (
    id_cliente integer NOT NULL,
    nombre_cliente character varying(30),
    correo_cliente character varying(30),
    pass character varying(200),
    numero1 character varying(10),
    numero2 character varying(10),
    resultado character varying(10),
    cod_cliente integer NOT NULL,
    cc_cliente character varying(10),
    resultado2 character varying(20),
    mod character varying(20),
    valor_venta character varying(20),
    iva character varying(20),
    precio_venta character varying(20),
    numero_p integer,
    base integer,
    potencia integer,
    fecha_modificacion timestamp with time zone,
    numero_inverso character varying(20)
);
    DROP TABLE public.clientes;
       public         postgres    false            �            1259    57428    clientes_cod_cliente_seq    SEQUENCE     �   CREATE SEQUENCE public.clientes_cod_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.clientes_cod_cliente_seq;
       public       postgres    false    197            U           0    0    clientes_cod_cliente_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.clientes_cod_cliente_seq OWNED BY public.clientes.cod_cliente;
            public       postgres    false    208            �            1259    24584    clientes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.clientes_id_seq;
       public       postgres    false    197            V           0    0    clientes_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id_cliente;
            public       postgres    false    196            �            1259    57355    edificio    TABLE     �   CREATE TABLE public.edificio (
    cod_edificio integer NOT NULL,
    numero_piso integer NOT NULL,
    numero_puesto integer NOT NULL,
    estado boolean,
    usu_login character varying(20),
    fecha_registro timestamp with time zone[] NOT NULL
);
    DROP TABLE public.edificio;
       public         postgres    false            �            1259    57353    edificio_cod_edificio_seq    SEQUENCE     �   CREATE SEQUENCE public.edificio_cod_edificio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.edificio_cod_edificio_seq;
       public       postgres    false    201            W           0    0    edificio_cod_edificio_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.edificio_cod_edificio_seq OWNED BY public.edificio.cod_edificio;
            public       postgres    false    200            �            1259    57390    factura_parquedero    TABLE        CREATE TABLE public.factura_parquedero (
    cod_factura integer NOT NULL,
    placa_vehiculo character varying(10),
    color_vehiculo character varying(15),
    origen_vehiculo character varying(20),
    fecha_hora_entrada timestamp with time zone NOT NULL,
    fecha_hora_salida timestamp with time zone,
    estado boolean,
    tipo_cobranza_veh integer NOT NULL,
    valor_cobranza character varying(20) NOT NULL,
    usu_login character varying(20),
    fecha_registro timestamp with time zone NOT NULL
);
 &   DROP TABLE public.factura_parquedero;
       public         postgres    false            �            1259    57388 "   factura_parquedero_cod_factura_seq    SEQUENCE     �   CREATE SEQUENCE public.factura_parquedero_cod_factura_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.factura_parquedero_cod_factura_seq;
       public       postgres    false    207            X           0    0 "   factura_parquedero_cod_factura_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.factura_parquedero_cod_factura_seq OWNED BY public.factura_parquedero.cod_factura;
            public       postgres    false    206            �            1259    65622    simulador_credito    TABLE     @  CREATE TABLE public.simulador_credito (
    id_simulador integer NOT NULL,
    capital character varying(20),
    tasa_de_interes character varying(20),
    tiempo character varying(20),
    interes character varying(20),
    monto character varying(20),
    cliente_cod integer,
    cc_cliente character varying(20)
);
 %   DROP TABLE public.simulador_credito;
       public         postgres    false            �            1259    65620 "   simulador_credito_id_simulador_seq    SEQUENCE     �   CREATE SEQUENCE public.simulador_credito_id_simulador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.simulador_credito_id_simulador_seq;
       public       postgres    false    210            Y           0    0 "   simulador_credito_id_simulador_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.simulador_credito_id_simulador_seq OWNED BY public.simulador_credito.id_simulador;
            public       postgres    false    209            �            1259    57377    tarifario_por_tipo_cobranza    TABLE     %  CREATE TABLE public.tarifario_por_tipo_cobranza (
    cod_tipo_cobranza integer NOT NULL,
    ano date NOT NULL,
    tipo_cobranza integer NOT NULL,
    valor_cobranza character varying(20) NOT NULL,
    usu_login character varying(20),
    fecha_registro timestamp with time zone NOT NULL
);
 /   DROP TABLE public.tarifario_por_tipo_cobranza;
       public         postgres    false            �            1259    57375 1   tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq    SEQUENCE     �   CREATE SEQUENCE public.tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 H   DROP SEQUENCE public.tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq;
       public       postgres    false    205            Z           0    0 1   tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq OWNED BY public.tarifario_por_tipo_cobranza.cod_tipo_cobranza;
            public       postgres    false    204            �            1259    57366 
   tipo_cobro    TABLE     �   CREATE TABLE public.tipo_cobro (
    cod_tipo_cobro integer NOT NULL,
    nombre_tipo_cobro character varying(20) NOT NULL,
    usu_login character varying(20),
    fecha_registro timestamp with time zone[] NOT NULL
);
    DROP TABLE public.tipo_cobro;
       public         postgres    false            �            1259    57364    tipo_cobro_cod_tipo_cobro_seq    SEQUENCE     �   CREATE SEQUENCE public.tipo_cobro_cod_tipo_cobro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.tipo_cobro_cod_tipo_cobro_seq;
       public       postgres    false    203            [           0    0    tipo_cobro_cod_tipo_cobro_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.tipo_cobro_cod_tipo_cobro_seq OWNED BY public.tipo_cobro.cod_tipo_cobro;
            public       postgres    false    202            �            1259    32785    usuarios    TABLE       CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre_usuario character varying(30),
    apellido_usuario character varying(30),
    email_usuario character varying(50),
    contrasena_usuario character varying(200),
    genero_usuario character varying(2)
);
    DROP TABLE public.usuarios;
       public         postgres    false            �            1259    32783    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public       postgres    false    199            \           0    0    usuarios_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id_usuario;
            public       postgres    false    198            �
           2604    24589    clientes id_cliente    DEFAULT     r   ALTER TABLE ONLY public.clientes ALTER COLUMN id_cliente SET DEFAULT nextval('public.clientes_id_seq'::regclass);
 B   ALTER TABLE public.clientes ALTER COLUMN id_cliente DROP DEFAULT;
       public       postgres    false    197    196    197            �
           2604    57430    clientes cod_cliente    DEFAULT     |   ALTER TABLE ONLY public.clientes ALTER COLUMN cod_cliente SET DEFAULT nextval('public.clientes_cod_cliente_seq'::regclass);
 C   ALTER TABLE public.clientes ALTER COLUMN cod_cliente DROP DEFAULT;
       public       postgres    false    208    197            �
           2604    57358    edificio cod_edificio    DEFAULT     ~   ALTER TABLE ONLY public.edificio ALTER COLUMN cod_edificio SET DEFAULT nextval('public.edificio_cod_edificio_seq'::regclass);
 D   ALTER TABLE public.edificio ALTER COLUMN cod_edificio DROP DEFAULT;
       public       postgres    false    201    200    201            �
           2604    57393    factura_parquedero cod_factura    DEFAULT     �   ALTER TABLE ONLY public.factura_parquedero ALTER COLUMN cod_factura SET DEFAULT nextval('public.factura_parquedero_cod_factura_seq'::regclass);
 M   ALTER TABLE public.factura_parquedero ALTER COLUMN cod_factura DROP DEFAULT;
       public       postgres    false    206    207    207            �
           2604    65625    simulador_credito id_simulador    DEFAULT     �   ALTER TABLE ONLY public.simulador_credito ALTER COLUMN id_simulador SET DEFAULT nextval('public.simulador_credito_id_simulador_seq'::regclass);
 M   ALTER TABLE public.simulador_credito ALTER COLUMN id_simulador DROP DEFAULT;
       public       postgres    false    210    209    210            �
           2604    57380 -   tarifario_por_tipo_cobranza cod_tipo_cobranza    DEFAULT     �   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza ALTER COLUMN cod_tipo_cobranza SET DEFAULT nextval('public.tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq'::regclass);
 \   ALTER TABLE public.tarifario_por_tipo_cobranza ALTER COLUMN cod_tipo_cobranza DROP DEFAULT;
       public       postgres    false    204    205    205            �
           2604    57369    tipo_cobro cod_tipo_cobro    DEFAULT     �   ALTER TABLE ONLY public.tipo_cobro ALTER COLUMN cod_tipo_cobro SET DEFAULT nextval('public.tipo_cobro_cod_tipo_cobro_seq'::regclass);
 H   ALTER TABLE public.tipo_cobro ALTER COLUMN cod_tipo_cobro DROP DEFAULT;
       public       postgres    false    202    203    203            �
           2604    32788    usuarios id_usuario    DEFAULT     r   ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 B   ALTER TABLE public.usuarios ALTER COLUMN id_usuario DROP DEFAULT;
       public       postgres    false    199    198    199            A          0    24586    clientes 
   TABLE DATA               �   COPY public.clientes (id_cliente, nombre_cliente, correo_cliente, pass, numero1, numero2, resultado, cod_cliente, cc_cliente, resultado2, mod, valor_venta, iva, precio_venta, numero_p, base, potencia, fecha_modificacion, numero_inverso) FROM stdin;
    public       postgres    false    197    V       E          0    57355    edificio 
   TABLE DATA               o   COPY public.edificio (cod_edificio, numero_piso, numero_puesto, estado, usu_login, fecha_registro) FROM stdin;
    public       postgres    false    201   �\       K          0    57390    factura_parquedero 
   TABLE DATA               �   COPY public.factura_parquedero (cod_factura, placa_vehiculo, color_vehiculo, origen_vehiculo, fecha_hora_entrada, fecha_hora_salida, estado, tipo_cobranza_veh, valor_cobranza, usu_login, fecha_registro) FROM stdin;
    public       postgres    false    207   �\       N          0    65622    simulador_credito 
   TABLE DATA               �   COPY public.simulador_credito (id_simulador, capital, tasa_de_interes, tiempo, interes, monto, cliente_cod, cc_cliente) FROM stdin;
    public       postgres    false    210   �\       I          0    57377    tarifario_por_tipo_cobranza 
   TABLE DATA               �   COPY public.tarifario_por_tipo_cobranza (cod_tipo_cobranza, ano, tipo_cobranza, valor_cobranza, usu_login, fecha_registro) FROM stdin;
    public       postgres    false    205   �]       G          0    57366 
   tipo_cobro 
   TABLE DATA               b   COPY public.tipo_cobro (cod_tipo_cobro, nombre_tipo_cobro, usu_login, fecha_registro) FROM stdin;
    public       postgres    false    203   �]       C          0    32785    usuarios 
   TABLE DATA               �   COPY public.usuarios (id_usuario, nombre_usuario, apellido_usuario, email_usuario, contrasena_usuario, genero_usuario) FROM stdin;
    public       postgres    false    199   �]       ]           0    0    clientes_cod_cliente_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.clientes_cod_cliente_seq', 79, true);
            public       postgres    false    208            ^           0    0    clientes_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.clientes_id_seq', 148, true);
            public       postgres    false    196            _           0    0    edificio_cod_edificio_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.edificio_cod_edificio_seq', 1, false);
            public       postgres    false    200            `           0    0 "   factura_parquedero_cod_factura_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.factura_parquedero_cod_factura_seq', 1, false);
            public       postgres    false    206            a           0    0 "   simulador_credito_id_simulador_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.simulador_credito_id_simulador_seq', 11, true);
            public       postgres    false    209            b           0    0 1   tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq    SEQUENCE SET     `   SELECT pg_catalog.setval('public.tarifario_por_tipo_cobranza_cod_tipo_cobranza_seq', 1, false);
            public       postgres    false    204            c           0    0    tipo_cobro_cod_tipo_cobro_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.tipo_cobro_cod_tipo_cobro_seq', 1, false);
            public       postgres    false    202            d           0    0    usuarios_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.usuarios_id_seq', 114, true);
            public       postgres    false    198            �
           2606    24591    clientes clientes_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id_cliente);
 @   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_pkey;
       public         postgres    false    197            �
           2606    57400    edificio edificio_estado_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.edificio
    ADD CONSTRAINT edificio_estado_key UNIQUE (estado);
 F   ALTER TABLE ONLY public.edificio DROP CONSTRAINT edificio_estado_key;
       public         postgres    false    201            �
           2606    57363    edificio edificio_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.edificio
    ADD CONSTRAINT edificio_pkey PRIMARY KEY (cod_edificio);
 @   ALTER TABLE ONLY public.edificio DROP CONSTRAINT edificio_pkey;
       public         postgres    false    201            �
           2606    57398 *   factura_parquedero factura_parquedero_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.factura_parquedero
    ADD CONSTRAINT factura_parquedero_pkey PRIMARY KEY (cod_factura);
 T   ALTER TABLE ONLY public.factura_parquedero DROP CONSTRAINT factura_parquedero_pkey;
       public         postgres    false    207            �
           2606    65657 (   simulador_credito simulador_credito_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.simulador_credito
    ADD CONSTRAINT simulador_credito_pkey PRIMARY KEY (id_simulador);
 R   ALTER TABLE ONLY public.simulador_credito DROP CONSTRAINT simulador_credito_pkey;
       public         postgres    false    210            �
           2606    57382 <   tarifario_por_tipo_cobranza tarifario_por_tipo_cobranza_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza
    ADD CONSTRAINT tarifario_por_tipo_cobranza_pkey PRIMARY KEY (cod_tipo_cobranza);
 f   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza DROP CONSTRAINT tarifario_por_tipo_cobranza_pkey;
       public         postgres    false    205            �
           2606    57407 I   tarifario_por_tipo_cobranza tarifario_por_tipo_cobranza_tipo_cobranza_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza
    ADD CONSTRAINT tarifario_por_tipo_cobranza_tipo_cobranza_key UNIQUE (tipo_cobranza);
 s   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza DROP CONSTRAINT tarifario_por_tipo_cobranza_tipo_cobranza_key;
       public         postgres    false    205            �
           2606    57409 J   tarifario_por_tipo_cobranza tarifario_por_tipo_cobranza_valor_cobranza_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza
    ADD CONSTRAINT tarifario_por_tipo_cobranza_valor_cobranza_key UNIQUE (valor_cobranza);
 t   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza DROP CONSTRAINT tarifario_por_tipo_cobranza_valor_cobranza_key;
       public         postgres    false    205            �
           2606    57374    tipo_cobro tipo_cobro_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.tipo_cobro
    ADD CONSTRAINT tipo_cobro_pkey PRIMARY KEY (cod_tipo_cobro);
 D   ALTER TABLE ONLY public.tipo_cobro DROP CONSTRAINT tipo_cobro_pkey;
       public         postgres    false    203            �
           2606    32793    usuarios usuarios_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public         postgres    false    199            �
           2606    57383 .   tarifario_por_tipo_cobranza cod_tipo_cobro_veh    FK CONSTRAINT     �   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza
    ADD CONSTRAINT cod_tipo_cobro_veh FOREIGN KEY (tipo_cobranza) REFERENCES public.tipo_cobro(cod_tipo_cobro);
 X   ALTER TABLE ONLY public.tarifario_por_tipo_cobranza DROP CONSTRAINT cod_tipo_cobro_veh;
       public       postgres    false    2744    203    205            e           0    0 <   CONSTRAINT cod_tipo_cobro_veh ON tarifario_por_tipo_cobranza    COMMENT     �   COMMENT ON CONSTRAINT cod_tipo_cobro_veh ON public.tarifario_por_tipo_cobranza IS 'relacionado con la tabla tipo cobro para traer el nombre de el tipo de cobranza que se esta somentiendo el vehiculo';
            public       postgres    false    2755            �
           2606    57401     factura_parquedero estado_puesto    FK CONSTRAINT     �   ALTER TABLE ONLY public.factura_parquedero
    ADD CONSTRAINT estado_puesto FOREIGN KEY (estado) REFERENCES public.edificio(estado);
 J   ALTER TABLE ONLY public.factura_parquedero DROP CONSTRAINT estado_puesto;
       public       postgres    false    207    201    2740            �
           2606    57415 $   factura_parquedero tipo_cobranza_veh    FK CONSTRAINT     �   ALTER TABLE ONLY public.factura_parquedero
    ADD CONSTRAINT tipo_cobranza_veh FOREIGN KEY (tipo_cobranza_veh) REFERENCES public.tarifario_por_tipo_cobranza(tipo_cobranza);
 N   ALTER TABLE ONLY public.factura_parquedero DROP CONSTRAINT tipo_cobranza_veh;
       public       postgres    false    2748    205    207            �
           2606    57420 %   factura_parquedero valor_cobranza_veh    FK CONSTRAINT     �   ALTER TABLE ONLY public.factura_parquedero
    ADD CONSTRAINT valor_cobranza_veh FOREIGN KEY (valor_cobranza) REFERENCES public.tarifario_por_tipo_cobranza(valor_cobranza);
 O   ALTER TABLE ONLY public.factura_parquedero DROP CONSTRAINT valor_cobranza_veh;
       public       postgres    false    2750    205    207            A   �  x��XKo�8>3�"��9��S��z��[�������������m9U"���R-���q�̓ܰ��z��=����ok�z��v�H��g�3&ؗOo��w��`�e��i�Y��zVL���,�B����o�-�l����	���K���a�*~���z��m>����>fb߷O^�	@-�^E�N��� bge�iUt�c+G������B�wf��],�<2�1#{����C�����tX���h����ǵow=������+@���}P��U�ՁJ�}y����p��}��+P;CӉ@Om�j�q��VJG��BR"Ph�@A�f�����A�� x�ފ���f�>ǍρtA,�$p9z�j� Z$�2,н�,@v��C���P o)�(P2����J�X;�ȓ24Iԧ�Ű@�L�N�)��I7eX�(�?��Rbʰ@Q*o�K�%)9eX� �)F^(G�	CY�}��Ǉ<�!�o�,��m�n&4�r�x�c3$EE7��B���ٺ@]Z��o�Y�e�qi=aW�-m&�
��݄]����+����*Е����Ԇ��O
>�8
Ng�F%��AB)��%�tQ�̏�,�s3+$L�s��H��τ<?�g+2��r<S�g���l�"<�ڸo#u�?�>�V�g��5�Ǯ�+Pn
y�t���<�豌us��@Hr�E2}G�Y��vq���*�aކT��"�v�Ap�c���L7C���3�L@�p:g�����Yۙ6��i��f��Tح6��w�����u��-%$��]祿,�z��W���z�4�V���}8�����._��]A�pTL�kvynX��g���O��tA�ҝ�ʠND���𐼒�-�:4���g5��4i��Yr9��p�zx�m-]���J9!�s̜��}���~s���G�����ʏBW�U�6��N�EZ^��1��I�T���A[Cb�6g��A���| ���T$�ye�P�������r ����cbĻ�uq�gר| W��OMl
{L��c���s|^�y���t� �U5����nL��R{��q
B֗W7�CS��t���M��'�=�;C�J��7M�S����|�Y(	Qs �kNVT��BB��:g_����5�5��9m-�%%�T�V�vIa��ܢ����TN/�GS@�"?���N�^�e�]V�xJs�2\�Nތ��>�SY�)w���E%�V�,!�5BNX#F�����2:bġm�ִ�q
t�X�QRŢ4�����s��OڞfB������XtR�z�"�D�xe�Z{.t�?y�<1bae2
 B�BK�)��� 脊9åҙ#�֪�\�{��KI��I/�EUaS�q�0P�
*EIؑ0��$=�g��fz�~��ܚ+ݪ�4D�iH+7���A��*+,�v�]�yn�ۛ݇��A��[4#��w��D��PЉB��-���Z�u39!kP��Ԑ��8�h�5�:#�ndgj䵒�G���r�8���(p;;�����R\��ru9����u;9�le��x/�]��On7�;�"F5��@%:F��H1JߨF���{O$b�V�"C��v~�_�Ö�X����|e��x��ǖ�*�|��F��kzQ������Sff�������YNΥ�u);)R�5��F~�R����a�
      E      x������ � �      K      x������ � �      N   �   x����1CϦ�(N����`��c�jO�rXK�'G�«�
��q%�J�J�J�J�Jl� &�C�d�q�pDI�7ö߁�g35�L��V.K���bЬ%�#V�=iA��k	�wn���4yL�D�      I      x������ � �      G      x������ � �      C   �  x��SM��0=�_��V�����S{�/	�X���*��ׁ̲�3�R�??���B�
��#48;0F�OZ+Q��m��UJx����d�+_��ԜA���X:O�r�&H�8�؟��q .��̳s�<�&y�8��i�7I >
ʆ\�MVN8!t�^UCD��tm"�i-�P��B�ꙵ�e}��3��s��*Z�I$7�5������ԏ��Lncٍ�5L�R0��[smޮϮM��囨����c���z��մ�n2؝A���C��@e������2��B�$��,%�#�SZ�]"���H�O��Xe�3�%��3��2#%Y��$��R?���
~���Q�Ȑ�~����K��O�[i��Q�OR|��..-��{�.���~��g�V��1�@��nKq��R{@V�G�<"�
����#�
Z^ޟ���Mݱ�m��	ȹZ'���(�?��z�     