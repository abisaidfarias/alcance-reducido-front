import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<Language>('es');
  private translations: Record<string, Record<Language, string>> = {
    // Navigation
    'nav.normativa': { es: 'Normativa', en: 'Regulations' },
    'nav.proceso': { es: 'Proceso', en: 'Process' },
    'nav.docs': { es: 'Docs', en: 'Docs' },
    'nav.fechas': { es: 'Fechas', en: 'Timeline' },
    'nav.servicios': { es: 'Servicios', en: 'Services' },
    'nav.qr': { es: 'QR', en: 'QR' },
    'nav.contacto': { es: 'Contacto', en: 'Contact' },
    'nav.distribuidores': { es: 'Distribuidores', en: 'Distributors' },
    'nav.login': { es: 'Login', en: 'Login' },
    'nav.menu': { es: 'Menú', en: 'Menu' },
    'nav.home': { es: 'Home', en: 'Home' },
    'nav.solicitar_certificacion': { es: 'Solicitar certificación', en: 'Request certification' },
    
    // Hero section
    'hero.pill': { es: 'Cumplimiento SUBTEL · equipos de alcance reducido · vigencia febrero 2026', en: 'SUBTEL compliance · reduced range equipment · effective February 2026' },
    'hero.title': { es: 'Certificación y cumplimiento de equipos de alcance reducido', en: 'Certification and compliance for reduced range equipment' },
    'hero.subtitle': { es: 'Servicio ejecutivo para **cumplir normativa SUBTEL** en Chile para dispositivos que operan con radiofrecuencia (WiFi, Bluetooth, Zigbee, RFID). En pocos días dejamos tu documentación ordenada, entregables listos y el camino claro para comercializar.', en: 'Executive service to **comply with SUBTEL regulations** in Chile for devices operating with radio frequency (WiFi, Bluetooth, Zigbee, RFID). In a few days we organize your documentation, deliver ready deliverables and clear the path to market.' },
    'hero.cta_certificacion': { es: 'Solicitar certificación', en: 'Request certification' },
    'hero.cta_qr': { es: 'Generar QR', en: 'Generate QR' },
    'hero.cta_normativa': { es: 'Conocer la normativa', en: 'Learn about regulations' },
    'hero.card_title': { es: 'Lo más importante', en: 'Most important' },
    'hero.card_desc': { es: 'Checklist claro, seguimiento y entregables listos para implementación (QR, documentación y soporte).', en: 'Clear checklist, tracking and deliverables ready for implementation (QR, documentation and support).' },
    'hero.portal_qr': { es: 'Portal web + QR', en: 'Web portal + QR' },
    'hero.portal_qr_desc': { es: 'Código QR listo para imprimir y pegar en el packaging, con acceso a la información requerida.', en: 'QR code ready to print and paste on packaging, with access to required information.' },
    'hero.proceso_rapido': { es: 'Proceso simple y rápido', en: 'Simple and fast process' },
    'hero.proceso_rapido_desc': { es: '4 pasos para avanzar desde "documentos" a "comercialización".', en: '4 steps to move from "documents" to "commercialization".' },
    'hero.acompanamiento': { es: 'Acompañamiento experto', en: 'Expert support' },
    'hero.acompanamiento_desc': { es: 'Revisión técnica, consistencia documental y soporte ante requerimientos.', en: 'Technical review, documentary consistency and support for requirements.' },
    
    // Normativa section
    'normativa.title': { es: 'Normativa: ¿qué es y por qué importa?', en: 'Regulations: what are they and why do they matter?' },
    'normativa.subtitle': { es: 'La normativa SUBTEL para **equipos de alcance reducido** define requisitos para importación, distribución y comercialización en Chile de dispositivos que operan con radiofrecuencia (ej. WiFi/Bluetooth/Zigbee/RFID). En la práctica, tu objetivo es **cumplir con el soporte técnico exigible** y mantener **trazabilidad**.', en: 'SUBTEL regulations for **reduced range equipment** define requirements for import, distribution and commercialization in Chile of devices operating with radio frequency (e.g. WiFi/Bluetooth/Zigbee/RFID). In practice, your goal is to **comply with required technical support** and maintain **traceability**.' },
    'normativa.portal_qr': { es: 'Portal web y QR (si aplica)', en: 'Web portal and QR (if applicable)' },
    'normativa.portal_qr_desc': { es: 'Implementación de acceso web conforme a SUBTEL y generación de código QR listo para empaque.', en: 'Web access implementation compliant with SUBTEL and QR code generation ready for packaging.' },
    'normativa.documentacion': { es: 'Documentación digital', en: 'Digital documentation' },
    'normativa.documentacion_desc': { es: 'Soporte técnico organizado para respaldo y consultas, con trazabilidad.', en: 'Organized technical support for backup and queries, with traceability.' },
    'normativa.proceso': { es: 'Proceso actualizado', en: 'Updated process' },
    'normativa.proceso_desc': { es: 'Te ayudamos a adaptar el proceso y dejarlo "operable" para tu equipo y tus proveedores.', en: 'We help you adapt the process and make it "operable" for your team and suppliers.' },
    
    // Como funciona section
    'como.title': { es: 'Cómo certificar / cumplir en 4 pasos', en: 'How to certify / comply in 4 steps' },
    'como.subtitle': { es: 'Proceso simple para avanzar rápido desde documentación hasta salida a mercado.', en: 'Simple process to quickly move from documentation to market launch.' },
    'como.paso1': { es: 'Envíanos la información', en: 'Send us the information' },
    'como.paso1_desc': { es: 'Recibimos tu documentación técnica y revisamos consistencia (modelo, tecnología, variante, etc.).', en: 'We receive your technical documentation and review consistency (model, technology, variant, etc.).' },
    'como.paso2': { es: 'Habilitamos un portal web', en: 'We enable a web portal' },
    'como.paso2_desc': { es: 'Implementamos un acceso web de acuerdo a la normativa SUBTEL con la información comercial y técnica.', en: 'We implement web access according to SUBTEL regulations with commercial and technical information.' },
    'como.paso3': { es: 'Acceso al portal Web y Código QR', en: 'Web portal access and QR code' },
    'como.paso3_desc': { es: 'Te generamos el código QR necesario para imprimir y listo para pegar en el packing.', en: 'We generate the QR code needed to print and ready to paste on packaging.' },
    'como.paso4': { es: 'Comercializa cumpliendo', en: 'Market while complying' },
    'como.paso4_desc': { es: 'Quedas listo para importar/distribuir/comercializar con respaldo documental y trazabilidad.', en: 'You are ready to import/distribute/commercialize with documentary support and traceability.' },
    
    // Equipos section
    'equipos.title': { es: 'Equipos típicos de alcance reducido', en: 'Typical reduced range equipment' },
    'equipos.subtitle': { es: 'Dispositivos que usan radiofrecuencia de corto alcance. (Lista referencial: ajustamos por tu caso.)', en: 'Devices using short-range radio frequency. (Reference list: we adjust for your case.)' },
    'equipos.wifi': { es: 'WiFi', en: 'WiFi' },
    'equipos.wifi_desc': { es: 'Routers, access points, IoT, cámaras, domótica.', en: 'Routers, access points, IoT, cameras, home automation.' },
    'equipos.bluetooth': { es: 'Bluetooth', en: 'Bluetooth' },
    'equipos.bluetooth_desc': { es: 'Auriculares, parlantes, wearables, accesorios.', en: 'Headphones, speakers, wearables, accessories.' },
    'equipos.zigbee': { es: 'Zigbee', en: 'Zigbee' },
    'equipos.zigbee_desc': { es: 'Domótica, hubs, sensores inteligentes, controladores.', en: 'Home automation, hubs, smart sensors, controllers.' },
    'equipos.rfid': { es: 'RFID', en: 'RFID' },
    'equipos.rfid_desc': { es: 'Tags, lectores, control de acceso, inventario.', en: 'Tags, readers, access control, inventory.' },
    
    // Documentos section
    'docs.title': { es: 'Documentos necesarios', en: 'Required documents' },
    'docs.subtitle': { es: 'Para iniciar, necesitamos el set mínimo de documentos.', en: 'To start, we need the minimum set of documents.' },
    'docs.fotos': { es: 'Fotos internas y externas', en: 'Internal and external photos' },
    'docs.fotos_desc': { es: 'Imágenes claras del interior y exterior del equipo.', en: 'Clear images of the interior and exterior of the equipment.' },
    'docs.reportes_rf': { es: 'Reportes RF', en: 'RF reports' },
    'docs.reportes_rf_desc': { es: 'Ensayos RF / test report del módulo o equipo (según corresponda).', en: 'RF tests / test report of the module or equipment (as applicable).' },
    'docs.ficha_tecnica': { es: 'Ficha técnica', en: 'Technical sheet' },
    'docs.ficha_tecnica_desc': { es: 'Especificaciones y características técnicas del producto.', en: 'Product specifications and technical characteristics.' },
    'docs.distribuidor': { es: 'Distribuidor / Importador', en: 'Distributor / Importer' },
    'docs.distribuidor_desc': { es: 'Datos del distribuidor/importador y contacto comercial/técnico.', en: 'Distributor/importer data and commercial/technical contact.' },
    
    // Timeline section
    'timeline.title': { es: 'Timeline hacia 2026', en: 'Timeline to 2026' },
    'timeline.subtitle': { es: 'Para planificar tu transición y evitar atrasos logísticos.', en: 'To plan your transition and avoid logistical delays.' },
    'timeline.mayo_2025': { es: 'Mayo 2025', en: 'May 2025' },
    'timeline.publicacion': { es: 'Publicación normativa', en: 'Regulation publication' },
    'timeline.publicacion_desc': { es: 'Se publica la resolución y comienza el proceso de adopción.', en: 'The resolution is published and the adoption process begins.' },
    'timeline.hoy_2026': { es: 'Hoy – Febrero 2026', en: 'Today – February 2026' },
    'timeline.transicion': { es: 'Transición', en: 'Transition' },
    'timeline.transicion_desc': { es: 'Preparación de portal web, QR y documentación mínima por modelo.', en: 'Preparation of web portal, QR and minimum documentation per model.' },
    'timeline.feb_2026': { es: '22 Febrero 2026', en: 'February 22, 2026' },
    'timeline.vigencia': { es: 'Entrada en vigencia', en: 'Entry into force' },
    'timeline.vigencia_desc': { es: 'Los equipos comercializados deben cumplir con el soporte/implementación aplicable.', en: 'Commercialized equipment must comply with applicable support/implementation.' },
    'timeline.post_2026': { es: 'Post 2026', en: 'Post 2026' },
    'timeline.control': { es: 'Control y trazabilidad', en: 'Control and traceability' },
    'timeline.control_desc': { es: 'Mantener respaldo técnico y coherencia documental ante requerimientos.', en: 'Maintain technical backup and documentary coherence for requirements.' },
    
    // Servicios section
    'servicios.title': { es: 'Nuestros servicios', en: 'Our services' },
    'servicios.subtitle': { es: 'Soluciones completas para certificación / cumplimiento de equipos de alcance reducido.', en: 'Complete solutions for certification / compliance of reduced range equipment.' },
    'servicios.destacado': { es: 'Destacado', en: 'Featured' },
    'servicios.certificacion': { es: 'Certificación / Cumplimiento SUBTEL', en: 'SUBTEL Certification / Compliance' },
    'servicios.certificacion_desc': { es: 'Checklist, revisión documental y acompañamiento integral.', en: 'Checklist, documentary review and comprehensive support.' },
    'servicios.portal_qr': { es: 'Portal web + QR', en: 'Web portal + QR' },
    'servicios.portal_qr_desc': { es: 'Código QR listo para impresión y acceso web con la información requerida por SUBTEL.', en: 'QR code ready for printing and web access with information required by SUBTEL.' },
    'servicios.plataforma': { es: 'Plataforma digital', en: 'Digital platform' },
    'servicios.plataforma_desc': { es: 'Repositorio seguro de documentación, control de versiones y trazabilidad.', en: 'Secure documentation repository, version control and traceability.' },
    'servicios.documentacion': { es: 'Documentación técnica', en: 'Technical documentation' },
    'servicios.documentacion_desc': { es: 'Revisión, normalización y soporte para pedir correcciones al fabricante (si falta algo).', en: 'Review, normalization and support to request corrections from the manufacturer (if something is missing).' },
    
    // QR section
    'qr.title': { es: 'Generar QR', en: 'Generate QR' },
    'qr.subtitle': { es: 'Te entregamos el código QR listo para imprimir y pegar en el packing, con acceso al portal web conforme a la normativa SUBTEL.', en: 'We deliver the QR code ready to print and paste on packaging, with access to the web portal compliant with SUBTEL regulations.' },
    'qr.paso1': { es: '1) Envía tu modelo', en: '1) Send your model' },
    'qr.paso1_desc': { es: 'Marca, modelo y tecnología (WiFi/Bluetooth/Zigbee/RFID) + país de comercialización (Chile).', en: 'Brand, model and technology (WiFi/Bluetooth/Zigbee/RFID) + commercialization country (Chile).' },
    'qr.paso2': { es: '2) Validamos documentos', en: '2) We validate documents' },
    'qr.paso2_desc': { es: 'Revisamos el set mínimo y te pedimos lo faltante para generar el QR con respaldo.', en: 'We review the minimum set and ask for what is missing to generate the QR with support.' },
    'qr.paso3': { es: '3) Te entregamos QR', en: '3) We deliver QR' },
    'qr.paso3_desc': { es: 'Archivo listo para impresión y uso en empaque, asociado al portal web.', en: 'File ready for printing and use in packaging, associated with the web portal.' },
    'qr.cta': { es: 'Quiero generar QR →', en: 'I want to generate QR →' },
    'qr.asesor': { es: 'Hablar con un asesor', en: 'Talk to an advisor' },
    
    // CTA section
    'cta.title': { es: '¿Listo para cumplir y salir rápido?', en: 'Ready to comply and launch quickly?' },
    'cta.subtitle': { es: 'Envíanos el modelo del equipo + tecnología (WiFi/Bluetooth/Zigbee/RFID). Te respondemos con checklist, ruta crítica y próximos pasos.', en: 'Send us the equipment model + technology (WiFi/Bluetooth/Zigbee/RFID). We respond with checklist, critical path and next steps.' },
    'cta.email': { es: 'Escribir por email', en: 'Write by email' },
    'cta.contacto': { es: 'Ver contacto', en: 'View contact' },
    
    // Contacto section
    'contacto.title': { es: 'Contacto', en: 'Contact' },
    'contacto.email': { es: 'Email', en: 'Email' },
    'contacto.telefono': { es: 'Teléfono / WhatsApp', en: 'Phone / WhatsApp' },
    'contacto.wechat': { es: 'WeChat', en: 'WeChat' },
    'contacto.operado': { es: 'Operado por', en: 'Operated by' },
    'contacto.operado_desc': { es: 'Santiago, Chile · Atención remota y coordinación logística', en: 'Santiago, Chile · Remote service and logistical coordination' },
    
    // Distribuidor Selector Modal
    'selector.title': { es: 'Seleccionar Distribuidor', en: 'Select Distributor' },
    'selector.subtitle': { es: 'Selecciona un distribuidor para continuar', en: 'Select a distributor to continue' },
    'selector.label': { es: 'Distribuidor', en: 'Distributor' },
    'selector.placeholder': { es: 'Buscar distribuidor...', en: 'Search distributor...' },
    'selector.required': { es: 'Debe seleccionar un distribuidor', en: 'You must select a distributor' },
    'selector.no_data': { es: 'No hay distribuidores disponibles', en: 'No distributors available' },
    'selector.cancel': { es: 'Cancelar', en: 'Cancel' },
    'selector.go': { es: 'Ir al Distribuidor', en: 'Go to Distributor' },

    // Footer
    'footer.derechos': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
    
    // Login
    'login.title': { es: 'Iniciar Sesión', en: 'Sign In' },
    'login.email': { es: 'Email', en: 'Email' },
    'login.email_required': { es: 'El email es requerido', en: 'Email is required' },
    'login.email_invalid': { es: 'Email inválido', en: 'Invalid email' },
    'login.password': { es: 'Contraseña', en: 'Password' },
    'login.password_required': { es: 'La contraseña es requerida', en: 'Password is required' },
    'login.password_minlength': { es: 'La contraseña debe tener al menos 6 caracteres', en: 'Password must be at least 6 characters' },
    'login.submit': { es: 'Iniciar Sesión', en: 'Sign In' },
    'login.loading': { es: 'Cargando...', en: 'Loading...' },
    
    // Representante
    'representante.pagina_distribuidor': { es: 'Página del distribuidor / importador', en: 'Distributor / importer page' },
    'representante.seleccionar_marca': { es: 'Selecciona una marca para ver los equipos disponibles. Esta página corresponde al importador/distribuidor asociado al QR del empaque.', en: 'Select a brand to see available equipment. This page corresponds to the importer/distributor associated with the packaging QR.' },
    'representante.buscar_marca': { es: 'Buscar marca (ej: Xiaomi, Samsung, Nothing…)', en: 'Search brand (e.g: Xiaomi, Samsung, Nothing…)' },
    'representante.ver_modelos': { es: 'Ver modelos disponibles', en: 'View available models' },
    'representante.no_marcas': { es: 'No se encontraron marcas con ese nombre', en: 'No brands found with that name' },
    'representante.sin_marcas': { es: 'No hay marcas disponibles', en: 'No brands available' },
    'representante.marca_habilitada': { es: 'Marca habilitada', en: 'Enabled brand' },
    'representante.seleccionar_modelo': { es: 'Selecciona un modelo para acceder a la información comercial y técnica asociada al QR del empaque.', en: 'Select a model to access commercial and technical information associated with the packaging QR.' },
    'representante.buscar_modelo': { es: 'Buscar modelo (ej: v10, v11…)', en: 'Search model (e.g: v10, v11…)' },
    'representante.ver_info': { es: 'Ver información del dispositivo', en: 'View device information' },
    'representante.no_modelos': { es: 'No se encontraron modelos con ese nombre', en: 'No models found with that name' },
    'representante.sin_dispositivos': { es: 'No hay dispositivos disponibles para esta marca', en: 'No devices available for this brand' },
    'representante.ficha_dispositivo': { es: 'Ficha del dispositivo', en: 'Device sheet' },
    'representante.info_comercial': { es: 'A. INFORMACIÓN COMERCIAL', en: 'A. COMMERCIAL INFORMATION' },
    'representante.info_comercial_sub': { es: 'Datos de publicación y contacto', en: 'Publication and contact data' },
    'representante.fecha_publicacion': { es: 'FECHA DE PUBLICACIÓN', en: 'PUBLICATION DATE' },
    'representante.nombre_comercial': { es: 'NOMBRE COMERCIAL DEL EQUIPO', en: 'COMMERCIAL NAME OF EQUIPMENT' },
    'representante.fabricante': { es: 'FABRICANTE', en: 'MANUFACTURER' },
    'representante.importador': { es: 'IMPORTADOR O REPRESENTANTE EN CHILE', en: 'IMPORTER OR REPRESENTATIVE IN CHILE' },
    'representante.domicilio': { es: 'DOMICILIO', en: 'ADDRESS' },
    'representante.email_contacto': { es: 'CORREO ELECTRÓNICO DE CONTACTO', en: 'CONTACT EMAIL' },
    'representante.sitio_web': { es: 'SITIO WEB', en: 'WEBSITE' },
    'representante.no_disponible': { es: 'No disponible', en: 'Not available' },
    'representante.importante_representante': { es: 'Importante sobre el representante:', en: 'Important about the representative:' },
    'representante.importante_texto': { es: 'Según confirmación oficial de OIRS-SUBTEL, el importador o representante debe tener domicilio legal en Chile. Es un requisito obligatorio sin excepciones.', en: 'According to official confirmation from OIRS-SUBTEL, the importer or representative must have a legal address in Chile. It is a mandatory requirement without exceptions.' },
    'representante.imagen': { es: 'IMAGEN', en: 'IMAGE' },
    'representante.fotografia': { es: 'Fotografía del equipo', en: 'Equipment photograph' },
    'representante.sin_imagen': { es: 'Sin imagen', en: 'No image' },
    'representante.caracteristicas': { es: 'B. CARACTERÍSTICAS TÉCNICAS', en: 'B. TECHNICAL CHARACTERISTICS' },
    'representante.resolucion': { es: 'Resolución', en: 'Resolution' },
    'representante.parametro': { es: 'PARÁMETRO', en: 'PARAMETER' },
    'representante.valor': { es: 'VALOR', en: 'VALUE' },
    'representante.tipo_dispositivo': { es: 'Tipo de Dispositivo', en: 'Device Type' },
    'representante.fecha_certificacion': { es: 'Fecha de Certificación SUBTEL', en: 'SUBTEL Certification Date' },
    'representante.oficio_certificacion': { es: 'Oficio de Certificación SUBTEL', en: 'SUBTEL Certification Letter' },
    'representante.tecnologia': { es: 'Tecnología / modulación', en: 'Technology / modulation' },
    'representante.frecuencias': { es: 'Frecuencias', en: 'Frequencies' },
    'representante.ganancia_antena': { es: 'Ganancia de antena (dBi)', en: 'Antenna gain (dBi)' },
    'representante.eirp': { es: 'P.I.R.E. (EIRP)', en: 'E.I.R.P. (EIRP)' },
    'representante.modulos': { es: 'Módulos', en: 'Modules' },
    'representante.nombre_test_report': { es: 'Nombre de Test Report', en: 'Test Report Name' },
    'representante.informe_ensayo': { es: 'INFORME DE ENSAYO (TEST REPORT)', en: 'TEST REPORT' },
    'representante.informe_ensayo_desc': { es: 'En una página real, aquí se incluiría el PDF descargable del informe de ensayo.', en: 'On a real page, the downloadable PDF of the test report would be included here.' },
    'representante.descargar_test_report': { es: 'Descargar Test Report', en: 'Download Test Report' },
    'representante.declaracion': { es: 'C. DECLARACIÓN DE CONFORMIDAD', en: 'C. CONFORMITY DECLARATION' },
    'representante.texto_requerido': { es: 'Texto requerido', en: 'Required text' },
    'representante.declaracion_texto': { es: 'El equipo previamente individualizado cumple con las disposiciones establecidas en la Norma Técnica de Equipos de alcance reducido, aprobada por la resolución exenta N° 1.985, de 2017, de la Subsecretaría de Telecomunicaciones.', en: 'The previously identified equipment complies with the provisions established in the Technical Standard for Reduced Range Equipment, approved by exempt resolution No. 1,985, of 2017, of the Undersecretary of Telecommunications.' },
    'representante.declaracion_nota': { es: 'Este texto se presenta como declaración requerida por el proceso de alcance reducido. La documentación de respaldo se mantiene disponible para requerimientos.', en: 'This text is presented as a declaration required by the reduced scope process. Supporting documentation remains available for requirements.' },
    'representante.cargando': { es: 'Cargando información...', en: 'Loading information...' },
    'representante.solicitar_asesoria': { es: 'Solicitar asesoría', en: 'Request consultation' },
    'representante.volver_marcas': { es: 'Volver a marcas', en: 'Back to brands' },
    'representante.volver_modelos': { es: 'Volver a modelos', en: 'Back to models' },
    'representante.volver_dispositivos': { es: 'Volver a dispositivos', en: 'Back to devices' },
    'representante.info_disponible': { es: 'Información comercial y técnica disponible para consulta pública (QR del empaque). Contenido conforme a alcance reducido SUBTEL, según documentación proporcionada por el importador/distribuidor.', en: 'Commercial and technical information available for public consultation (packaging QR). Content compliant with reduced SUBTEL scope, according to documentation provided by the importer/distributor.' },
    
    // Footer
    'footer.alcance_reducido': { es: 'Alcance Reducido · Operado por LB Technology', en: 'Reduced Range · Operated by LB Technology' },
  };

  constructor() {
    // Cargar idioma guardado del localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      this.currentLanguage$.next(savedLang);
    }
  }

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  getCurrentLanguageValue(): Language {
    return this.currentLanguage$.value;
  }

  setLanguage(language: Language): void {
    this.currentLanguage$.next(language);
    localStorage.setItem('language', language);
  }

  translate(key: string): string {
    const lang = this.currentLanguage$.value;
    return this.translations[key]?.[lang] || key;
  }

  get(key: string): string {
    return this.translate(key);
  }
}
