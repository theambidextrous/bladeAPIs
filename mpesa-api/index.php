<?php
/*********************************************
Company:		Wits Technologies Ltd
Developer:	Sammy Mwaura Waweru, Idd Otuya
Mobile:			+254721428276
Email:			sammy@witstechnologies.co.ke
Website:		http://www.witstechnologies.co.ke/
*********************************************/
include 'config.php';
include 'config-alerts.php';

$tab = isset($_GET['do'])?$_GET['do']:'home';
$tab = strtolower($tab);
$nav[$tab] = "active";

if( $tab == 'validation' || $tab == 'confirmation' || $tab == 'callback' ){
	switch($tab){
		case "validate":
			require_once('mpesa.validate.php');
		break;
		case "confirmation":
			require_once('mpesa.confirmation.php');
		break;
		case "callback":
			require_once('mpesa.callbacks.php');
		break;
	}
	exit();
}

$_MESSAGE = array();
$_SESSION['CUST_FNAME'] = "Test";
$_SESSION['CUST_LNAME'] = "User";
$_SESSION['CUST_EMAIL'] = defined('CUST_EMAIL')?CUST_EMAIL:"info@witstechnologies.co.ke";
$_SESSION['CUST_PHONE'] = defined('CUST_PHONE')?CUST_PHONE:"+254721428276";
$_SESSION['REF'] = "INV101";
$_SESSION['REF_HASH'] = md5($_SESSION['REF']);
$_SESSION['AMOUNT'] = "10.00";
$_SESSION['FORMATTED_AMOUNT'] = number_format($_SESSION['AMOUNT'], 2);//format amount to 2 decimal places
$_SESSION['TRANS_DESC'] = "Demo transaction";
$_SESSION['TRANS_REMARKS'] = "Optional demo remarks";

function is_phone($phone) {
	$stripped = preg_replace("/(\(|\)|\-|\+)/","",preg_replace("/([  ]+)/","",$phone));
	return (!is_numeric($stripped) || ((strlen($stripped)<7) || (strlen($stripped)>13)))?FALSE:TRUE;
}

function is_email($email) {
	return filter_var($email, FILTER_VALIDATE_EMAIL)?(TRUE):(FALSE);
}

if( isset($_POST['Submit']) ){
	//Variables
	$FIELD = array();
	$fname = "config-alerts.php";		
	$msisdn = trim($_POST['msisdn']);
	$email = trim($_POST['email']);
	
	if( !is_phone($msisdn) ){
		$_MESSAGE['Phone'] = "A valid phone number is required";
	}else{
		$FIELD['CUST_PHONE'] = $msisdn;
	}

	if( !is_email($email) ) {
		$_MESSAGE['Email'] = "A valid email address is required";
	}else{
		$FIELD['CUST_EMAIL'] = $email;
	}
	
	if( !sizeof($_MESSAGE)>0 ){
		//write
		if(is_writable($fname)){
			$fhandle = fopen($fname,"wb");
			fwrite($fhandle, "<?php \n");			
			fwrite($fhandle, "define('CUST_PHONE', '".$FIELD['CUST_PHONE']."');\n");
			fwrite($fhandle, "define('CUST_EMAIL', '".$FIELD['CUST_EMAIL']."');\n");
			fwrite($fhandle, "?>");
			fclose($fhandle);
		}
		$_MESSAGE['Success'] = "<p><strong>UPDATED SUCCESSFULLY!</strong></p>";
	}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>M-Pesa API Example</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php
if( $tab == 'lipanampesa' ){
	echo '<meta http-equiv="refresh" content="30;URL=?do=callback&type=checkstatus">';
}
?>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<body>
<div class="container">
	<div class="jumbotron">
		<h1>M-Pesa API Example</h1>
		<p>For test purpose only. Parameters have been set to demo. Click on the product you want to test. Visit Safaricom Developer site (daraja) for more information.</p>
		<p class="text-center"> <a class="btn btn-primary btn-lg" href="https://developer.safaricom.co.ke/" target="_blank">Developer Site</a> <a class="btn btn-success btn-lg" href="https://developer.safaricom.co.ke/docs" target="_blank">Documentation</a> </p>
	</div>
</div>
<div class="container">
	<div class="row">
		<div class="col-md-4">
			<nav class="navigation" role="navigation">
				<ul class="nav nav-pills nav-stacked">
					<li class="<?=$nav['home']?>"><a href="./">Home</a></li> 
					<li class="<?=$nav['lipanampesa']?>"><a href="?do=lipanampesa">Lipa Na M-Pesa </a></li> 
					<li class="<?=$nav['c2b']?>"><a href="?do=c2b">C2B</a></li> 
					<li class="<?=$nav['b2c']?>"><a href="?do=b2c">B2C</a></li> 
					<li class="<?=$nav['b2b']?>"><a href="?do=b2b">B2B</a></li> 
					<li class="<?=$nav['transactionstatus']?>"><a href="?do=transactionstatus">Transaction Status</a></li> 
					<li class="<?=$nav['accountbalance']?>"><a href="?do=accountbalance">Account Balance</a></li> 
					<li class="<?=$nav['reversal']?>"><a href="?do=reversal">Reversal</a></li>
				</ul>
			</nav>
		</div>
		<div class="col-md-8">			
			<?php
				switch($tab){			
					case "lipanampesa":
						require_once('mpesa.lipanampesa.php');
					break;
					case "c2b":
						require_once('mpesa.c2b.php');
					break;
					case "b2c":
						require_once('mpesa.b2c.php');
					break;
					case "b2b":
						require_once('mpesa.b2b.php');
					break;
					case "transactionstatus":
						require_once('mpesa.transactionstatus.php');
					break;
					case "accountbalance":
						require_once('mpesa.accountbalance.php');
					break;
					case "reversal":
						require_once('mpesa.reversal.php');
					break;					
					default:
						?>
						<h3>M-Pesa API Example</h3>
						<p>This solution is for test purposes only. API parameters have been set to demo and transacted funds should be reversed automatically.</p>
						<p>IMPORTANT</p>
						<ol>
							<li>Use the form below to set the test email and phone number. NB: Phone MUST be an M-Pesa registered number.</li>
							<li>Click on the product you want to test from the left menu.</li>							
						</ol>
						<?php
						if( !empty($_MESSAGE) ){
							echo '<pre style="color:red;">';
							print_r($_MESSAGE);
							echo '</pre>';
						}
						?>
						</pre>
						<form class="form-inline" method="post" action="">
							<div class="form-group-sm">
								<label for="email">Email (for alerts): </label>
								<input type="email" name="email" id="email" value="<?php echo $_SESSION['CUST_EMAIL']; ?>" class="form-control">							
								<label for="msisdn">M-Pesa phone number: </label>
								<input type="tel" name="msisdn" id="msisdn" value="<?php echo $_SESSION['CUST_PHONE']; ?>" class="form-control">
							</div>
							<div style="margin-top:15px;">
								<input type="submit" name="Submit" value="Change Details" class="btn btn-success">
							</div>
						</form>
						<?php
					break;
				}
				?>
				<br>
		</div>
	</div>
</div>
<div class="container">
	<div class="row">
		<div class="col-md-12">
			<p class="text-center bg-info">Safaricom M-Pesa Example. Sample code by <a href="http://www.witstechnologies.co.ke/" target="_blank">Wits Technologies</a></p>
		</div>
	</div>
</div>
</body>
</html>