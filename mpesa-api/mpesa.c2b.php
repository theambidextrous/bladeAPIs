<?php
/*********************************************
Company:		Wits Technologies Ltd
Developer:	Sammy Mwaura Waweru, Idd Otuya
Mobile:			+254721428276
Email:			sammy@witstechnologies.co.ke
Website:		http://www.witstechnologies.co.ke/
*********************************************/
require_once('class.oauth.php');
require_once('class.mpesa.php');
$Mpesa = new Mpesa();


$ResponseType = "Cancelled";
$ConfirmationURL = SYSTEM_URL."/?do=callback&type=confirmation";
$ValidationURL = SYSTEM_URL."/?do=callback&type=validate";

$response = $Mpesa->registerurl(MPESA_SHORTCODE, $ResponseType, $ConfirmationURL, $ValidationURL);

$data = json_decode($response, true);

echo "<pre>";
print_r($response);
echo "</pre>";

$CommandID = "CustomerPayBillOnline";//Defaults to CustomerPayBillOnline
$Amount = number_format($_SESSION['AMOUNT'],0,"","" );//The amount to be transacted.
$PhoneNumber = $Mpesa->properMSISDN(CUST_PHONE);//The MSISDN sending the funds.
$BillRefNumber = $_SESSION['REF'];//Used with M-Pesa PayBills.

echo "<h2>You will be billed Ksh. ".$Amount." on M-Pesa number ".$PhoneNumber."</h2>";
echo "<p>A popup will appear on your M-PESA phone promting you to enter your PIN. If the popup does not appear, <a href=\"\">press here to try again.</a></p>";

$response = $Mpesa->c2b(MPESA_SHORTCODE, $CommandID, $Amount, $PhoneNumber, $BillRefNumber);

$data = json_decode($response, true);

echo "<pre>";
print_r($data);
echo "</pre>";

//$_SESSION['MERCHANTID'] = $data['MerchantRequestID'];
//$_SESSION['CHECKOUTREQUESTID'] = $data['CheckoutRequestID'];
?>