import json,re,unicodedata,collections,sys
def n(s): return unicodedata.normalize('NFD',s.lower()).encode('ascii','ignore').decode()
B=r'(?<![a-z0-9])'
G=[ # (categoria, patrones)  -- el orden desempata
 ('Máquinas de humo',[r'maquina de (humo|burbuja|niebla|nieve|espuma|co2|confeti)',r'maquina humo',r'hazer',r'fazer',r'fogger']),
 ('Soportes, fundas y estructuras',[r'soporte',r'pie (de|o|para|tripode|microfono)',r'tripode',r'prensa',r'clamp',r'clamo',r'gancho',r'truss',r'tramo',r'malacate',r'base (para|con)',r'colgador',r'morsa',r'morza',r'grampa',r'abrazadera',r'anvil',r'funda',r'estuche',r'case\b',r'bolso',r'bolsa',r'valija',r'manijas?',r'perno',r'tee de',r'estructura',r'aparejo',r'reja para',r'std-\d',r'perfil',r'flightcase',r'rack (de sonido|para)']),
 ('Cables y conectores',[r'cables?',r'conector',r'fichas?',r'plug',r'canon',r'jack',r'adaptador',r'snake',r'manguera',r'prolongador',r'zapatilla',r'alargue',r'patch',r'speakon',r'powercon',r'rca\b',r'bornera',r'xlr',r'neutrik',r'derivador',r'empalme']),
 ('Iluminación',[r'luz',r'luces',r'led\b',r'laser',r'lazer',r'cabezal(?! potenciado)',r'cabeza movil',r'moving',r'strobo',r'strobe',r'estrobo',r'bola',r'esfera',r'lamparas?',r'foco',r'dicroica',r'halogen',r'reflector',r'par ?\d',r'tacho',r'spot',r'beam',r'wash',r'banador',r'flash',r'baliza',r'tira (de )?(led|luces)',r'guirnalda',r'neon',r'ultravioleta',r'mascara',r'galponera',r'linterna',r'efecto',r'moonflower',r'derby',r'octobeam',r'starball',r'colorwall',r'blinder',r'minibrut',r'matrix',r'parabola',r'zocalo',r'ignitor',r'vidrio repuesto',r'motor (gbr )?(para )?(bola|esfera)',r'dmx',r'dimmer',r'roboscan',r'lite-?puter',r'navigator',r'circolina',r'cuarzo',r'proton',r'mushtec',r'spiro ?led',r'sunray',r'halo \d',r'cleo \d',r'city color',r'chromawash',r'hex-?led',r'pixel',r'iluminacion',r'tablero (de )?llaves']),
 ('Micrófonos',[r'microfonos?',r'micrófonos?',r'mics\b',r'corbatero',r'lavalier',r'anti ?pop',r'pop filter',r'vincha',r'receptor inalambrico de microfono',r'pipeta',r'sistema inalambrico',r'sl 85s',r'concert 288']),
 ('Auriculares',[r'auricular',r'in ear',r'almohadillas']),
 ('DJ y consolas',[r'consolas?',r'conzola',r'mixer',r'mezcladora',r'controlador',r'bandeja',r'giradisco',r'tornamesa',r'tocadisco',r'panos?\b',r'paño',r'slipmat',r'aguja',r'capsula magnetica',r'interfaz',r'interface',r'inteface',r'placa (de )?(sonido|audio)',r'cdj',r'xdj',r'ddj',r'caja directa',r'preamp',r'procesador',r'midi',r'software',r'driverack',r'cabezal potenciado',r'kit grabacion',r'sampler',r'intermix',r'placa inteface',r'scs ?3d',r'ultra-?di',r'umc ?\d',r'um2']),
 ('Parlantes y amplificación',[r'parlantes?',r'bafles?',r'baffle',r'columna',r'sub ?woofer',r'woofer',r'drivers?',r'tweeter',r'corneta',r'potencia(?! electric)',r'amplificador',r'crossover',r'croosover',r'divisor de frecuencia',r'ecualizador',r'monitor(es)? (de )?(estudio|escenario|profesional|bafle|speaker)',r'megafono',r'home ?theater',r'barra (de )?sonido',r'caja (activa|parlante|db|acustica)',r'altavoz',r'bocina',r'array',r'monitoreo personal',r'dm40',r'eurolive',r'notabrick']),
 ('Video y pantallas',[r'pantalla(?! galponera)',r'proyector',r'camara',r'videocamara',r'televisor',r'\btv\b',r'monitor led',r'antena',r'handycam']),
 ('Instrumentos',[r'guitarra',r'ukelele',r'bateria electronica',r'octapad',r'redoblante',r'platillo',r'partitura',r'atril',r'pandereta',r'maracas?',r'flauta',r'encordado',r'encordoamento',r'cuerdas',r'capodastro',r'afinador',r'guiro',r'metronomo',r'bombo',r'tambor',r'cencerro',r'teclado',r'banquito',r'pedal',r'cardan',r'bajo electrico']),
 ('Electrónica y repuestos',[r'transistor',r'circuito',r'integrado',r'resistencia',r'capacitor',r'fusible',r'fuente',r'transformador',r'soldador',r'estano',r'multimetro',r'multrimetro',r'tester',r'pinza',r'alicate',r'pilas?\b',r'bateria (portatil|recargable)',r'power ?bank',r'cargador',r'chip',r'diodo',r'rele\b',r'potenciometro',r'disipador',r'cooler',r'refrigerante',r'placa',r'termica',r'tomacorriente',r'interruptor',r'voltimetro',r'medidor',r'inversor',r'conversor',r'estabilizador',r'herramienta',r'destornillador',r'taladro',r'portero',r'timbre',r'motor',r'balasto',r'portalampara',r'telefono',r'radio',r'traductor',r'gps',r'repuesto',r'bomba']),
]
OTROS=[r'big max',r'cocina',r'cuchillo',r'ducha',r'planchita',r'almohada',r'pantalones',r'guantes',r'paleta',r'golf',r'droid',r'caja fuerte',r'cierre giratorio',r'rueda',r'mesa de luz',r'meza de luz',r'sacacorcho',r'destapador',r'arco nerf',r'nerf',r'monopatin',r'piedra',r'diccionario',r'flores? de ducha',r'organizador',r'cerradura',r'protector',r'casco',r'tarjeta',r'invitacion',r'album',r'disco de vinilo',r'cd original',r'baliza triangular']
OVERRIDES={ # revisados a mano
 'MLA764056612':'Auriculares','MLA1504959604':'Auriculares','MLA3168246272':'Auriculares','MLA758324173':'Auriculares','MLA1260369993':'Auriculares',
 'MLA1803973171':'Micrófonos','MLA764539487':'Instrumentos','MLA731247567':'Soportes, fundas y estructuras',
 'MLA1434513602':'Soportes, fundas y estructuras','MLA2055217473':'DJ y consolas',
 'MLA1779007360':'Video y pantallas','MLA1410102498':'Video y pantallas','MLA1893000823':'Otros','MLA4031444148':'Instrumentos',
}
def cat(title):
    t=n(title)
    if re.search(B+r'link de pago',t): return None
    if re.search(B+r'(liquido|fluido|fluid)',t): return ('Máquinas de humo','Líquidos')
    if re.search(r'maquina de (humo|burbuja|niebla|nieve|espuma|co2)|maquina humo|maquinas? de efecto|hazer|fazer',t) and not re.search(r'^\s*(liquido)',t):
        return ('Máquinas de humo','Burbujas' if 'burbuja' in t else 'Máquinas y repuestos')
    for o in OTROS:
        m=re.search(B+o,t)
        if m and m.start()<12: return 'Otros'
    best=None
    for gi,(c,pats) in enumerate(G):
        for p in pats:
            m=re.search(B+p,t)
            if m and (best is None or (m.start(),gi)<best[:2]): best=(m.start(),gi,c)
    if not best: return 'Otros'
    c=best[2]
    if c=='Soportes, fundas y estructuras':
        if re.search(r'notebook|laptop',t): return 'DJ y consolas'
        if re.search(r'microfono|mics',t): return 'Micrófonos'
        if re.search(r'auricular',t): return 'Auriculares'
        if re.search(r'guitarra|bajo|teclado|redoblante|platillo|partitura|octapad|bateria|cencerro',t): return 'Instrumentos'
    if c=='Micrófonos' and re.search(r'stanton',t) and 'vincha' in t: return 'Auriculares'
    if c=='DJ y consolas' and re.search(r'dmx|dimmer|tablero',t): return 'Iluminación'
    if c=='Cables y conectores':
        if re.search(r'microfono|condenser',t) and not re.search(r'^(rollo |pack \d+ )?cable',t): return 'Micrófonos'
        if re.search(r'estructura|truss|k ?9\d\d',t): return 'Soportes, fundas y estructuras'
    if c=='Electrónica y repuestos':
        if re.search(r'driver|parlante|bafle',t): return 'Parlantes y amplificación'
        if re.search(r'microfono',t): return 'Micrófonos'
        if re.search(r'pedal|instrumento|guitarra',t): return 'Instrumentos'
    if c=='Soportes, fundas y estructuras' and re.search(r'stanton',t) and 'vincha' in t: return 'Auriculares'
    if c=='Micrófonos' and re.search(r'^linterna',t): return 'Iluminación'
    return c
