<?php 
/********************************************* 
Company:		Wits Technologies Ltd
Developer:	Sammy Mwaura Waweru
Mobile:			+254721428276
Email:			sammy@witstechnologies.co.ke
Website:		http://www.witstechnologies.co.ke/
*********************************************/ 

#Handle Errors 
error_reporting(E_ALL ^ E_NOTICE);
header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1 
header('Expires: Sun, 17 Jan 1982 08:52:00 GMT'); // Date in the past
#Enable Sessions 
session_start();
#Timezone Settings 
date_default_timezone_set('Africa/Nairobi');
#Site Settings 
define('SYSTEM_NAME', 'M-PESA TEST');
define('SYSTEM_SHORT_NAME', 'M-PESA TEST');
define('SYSTEM_URL', 'https://www.witstechnologies.co.ke/temp/mpesa-api');
define('SYSTEM_LOGO_URL', 'https://www.witstechnologies.co.ke/temp/mpesa-api/images/lipa-na-mpesa.png');
#MPESA API Details
define("MPESA_API_ENV","sandbox"); // Either "sandbox" or "live"
define("MPESA_CONSUMER_KEY","TDoogvt6SA8HW8Wm9ZWwjPH2p60ZJCIb");//DEMO ONLY
define("MPESA_CONSUMER_SECRET","woNeFywaXc1yU0R8");//DEMO ONLY
define("MPESA_SHORTCODE","174379");//DEMO ONLY
define("MPESA_PASSKEY","bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919");//DEMO ONLY
?>