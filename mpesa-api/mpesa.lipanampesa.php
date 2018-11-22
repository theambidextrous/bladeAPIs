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
						
$TransactionType = "CustomerPayBillOnline";//Defaults to CustomerPayBillOnline
$Amount = number_format($_SESSION['AMOUNT'],0,"","" );//The amount to be transacted.
$PartyA = $Mpesa->properMSISDN(CUST_PHONE);//The MSISDN sending the funds.
$PartyB = MPESA_SHORTCODE;//The organization shortcode receiving the funds
$PhoneNumber = $Mpesa->properMSISDN(CUST_PHONE);//The MSISDN sending the funds.
$CallBackURL = SYSTEM_URL."/?do=callback&type=lipanampesa";//The url to where responses from M-Pesa will be sent to.
$AccountReference = $_SESSION['REF'];//Used with M-Pesa PayBills.
$TransactionDesc = $_SESSION['TRANS_DESC'];//A description of the transaction.
$Remark = $_SESSION['TRANS_REMARKS'];//Comments that are sent along with the transaction.

echo "<h2>You will be billed Ksh. ".$Amount." on M-Pesa number ".$PhoneNumber."</h2>";
echo "<p>A popup will appear on your M-PESA phone promting you to enter your PIN. If the popup does not appear, <a href=\"\">press here to try again.</a></p>";

$response = $Mpesa->STKPushSimulation(MPESA_SHORTCODE, MPESA_PASSKEY, $TransactionType, $Amount, $PartyA, $PartyB, $PhoneNumber, $CallBackURL, $AccountReference, $TransactionDesc, $Remark);

$data = json_decode($response, true);

echo "<pre>";
print_r($data);
echo "</pre>";

//$_SESSION['MERCHANTID'] = $data['MerchantRequestID'];
$_SESSION['CHECKOUTREQUESTID'] = $data['CheckoutRequestID'];
?>