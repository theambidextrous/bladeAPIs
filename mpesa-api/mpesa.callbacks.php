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

// Recipient as set on alerts config file
$to = CUST_EMAIL;
// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: webmaster@witstechnologies.co.ke";

//Get requested transaction type					
$transactiontype = isset($_GET['type'])?$_GET['type']:"";
$transactiontype = strtolower($transactiontype);
switch($transactiontype) {
	case "lipanampesa":
		$postdata = $Mpesa->getDataFromCallback();
		
		$data = json_decode($postdata, TRUE);
		
		//$MerchantRequestID = $data["Body"]["stkCallback"]["MerchantRequestID"];
		$CheckoutRequestID = $data["Body"]["stkCallback"]["CheckoutRequestID"];
		$ResultCode = $data["Body"]["stkCallback"]["ResultCode"];
		$ResultDesc = $data["Body"]["stkCallback"]["ResultDesc"];		
				
		$status = $ResultCode==0?"COMPLETED":"FAILED";

		//Notify developer/owner
		$subject = "M-Pesa Test Callback: Result code for developer";
		$msg = "<html>
		<head>
		<title>".$subject."</title>
		</head>
		<body>
		<p>Callback returned data for developer use: </p>
		<pre>".print_array($data)."</pre>
		</body>
		</html>";
		mail($to, $subject, $msg, $headers);
		
		if( !empty($CheckoutRequestID) && $ResultCode == 0 ){
			$CallbackMetadata = $data["Body"]["stkCallback"]["CallbackMetadata"]["Item"];
			$amount = $CallbackMetadata[0]["Value"];
			$formatted_amount = number_format( intval($CallbackMetadata[0]["Value"]),2 );//format amount to 2 decimal places
			$phonenumber = $CallbackMetadata[4]["Value"];
			
			//Save to database	
			//Notify user/owner
			$subject = "M-Pesa Test Callback: Transaction completed successfully";
			$msg = "<html>
			<head>
			<title>".$subject."</title>
			</head>
			<body>
			<p>Your payment of KES ".$formatted_amount." to M-Pesa Test was updated with status ".$status.". Thank you.</p>			
			</body>
			</html>";
			mail($to, $subject, $msg, $headers);
		}else{
			//Capture error logs
			//Save to database	
			//Notify user/owner/developer
			$subject = "M-Pesa Test Callback: Error completing the transaction";
			$msg = "<html>
			<head>
			<title>".$subject."</title>
			</head>
			<body>
			<p>Error completing the transaction. Error status:</br>Transaction Ref: ".$CheckoutRequestID."</br>Result Code: ".$ResultCode."</br>Result Description: ".$ResultDesc."</p>			
			</body>
			</html>";
			mail($to, $subject, $msg, $headers);
		}
		
		if($ResultCode==0){																
			ob_start();
			$Mpesa->finishTransaction();
			ob_flush();
			exit;
		}
	break;
	case "checkstatus":
		$CheckoutRequestID = $_SESSION['CHECKOUTREQUESTID'];
		
		$timestamp = date("Ymdhis");
		$password = base64_encode(MPESA_SHORTCODE.MPESA_PASSKEY.$timestamp);
		$confirmquery = $Mpesa->STKPushQuery(MPESA_API_ENV, $CheckoutRequestID, MPESA_SHORTCODE, $password, $timestamp);
		
		$data = json_decode($confirmquery, TRUE);
		
		echo "<pre>";
		print_r($data);
		echo "</pre>";
		
		$ResultCode = intval($data['ResultCode']);
		$ResultDesc = $data['ResultDesc'];
		$status = $ResultCode==0?"COMPLETED":"PROCESSING";
		
		if( !empty($CheckoutRequestID) && !empty($ResultCode) ){
			$formatted_amount = number_format($_SESSION['AMOUNT'],0,"","" );
			
			//Save to database	
			//Notify user/owner
			$subject = "M-Pesa Test Payment Status: ".$status;
			$msg = "<html>
			<head>
			<title>".$subject."</title>
			</head>
			<body>
			<p>Your payment of KES ".$formatted_amount." to M-Pesa Test was updated with status ".$status.". Thank you.</p>
			<p>Gateway Response:</br>Transaction Ref: ".$CheckoutRequestID."</br>Result Code: ".$ResultCode."</br>Result Description: ".$ResultDesc."</p>			
			</body>
			</html>";
			mail($to, $subject, $msg, $headers);
		}
		
	break;
	default:
		echo "Invalid request! The system failed to process your request. If the problem persists, please contact webmaster.";
	break;
}

function print_array($val = NULL){
	ob_start();
  print_r($val);
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
}