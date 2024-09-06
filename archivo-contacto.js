
const contactInfo = document.getElementById('contact-info');


const whatsappLink = document.createElement('a');
whatsappLink.href = 'https://wa.me/2614667205'; // 
whatsappLink.textContent = 'Por cualquier consulta, comunicate con nosotros a través WhatsApp';
whatsappLink.style.display = 'block'; 
whatsappLink.style.fontSize = '20px'; 
whatsappLink.style.marginBottom = '20px';


const mapIframe = document.createElement('iframe');
mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214445.71922459314!2d-68.92797698336659!3d-32.87927611786908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0907b3f6324b%3A0x501d1521958dfb21!2sPlaza%20Independencia!5e0!3m2!1ses!2sar!4v1725652320308!5m2!1ses!2sar"  
mapIframe.width = '600';
mapIframe.height = '450';
mapIframe.style.border = '0';
mapIframe.allowFullscreen = '';
mapIframe.loading = 'lazy';


contactInfo.appendChild(whatsappLink);
contactInfo.appendChild(mapIframe);
