<?php
if($_POST)
{
    $to_email       = "your_email@mail.com"; //Recipient email, Replace with own email here
   
    //check if its an ajax request, exit if not
    if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
       
        $output = json_encode(array( //create JSON data
            'type'=>'error',
            'text' => 'Sorry Request must be Ajax POST'
        ));
        die($output); //exit script outputting json data
    }
   
    //Sanitize input data using PHP filter_var().
    $name      = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
    $email     = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $message   = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
    $from = 'email_from@mail.com'; // Sender of contacts form emails
    $subject = 'New Subscriber'; // Set the subject of email which you will receive
      
    //email body
    $message_body = $message."\r\n\r\n-".$name."\r\nEmail : ".$email;
   
    //proceed with PHP email.
    $headers = 'From: '.$from.'' . "\r\n" .
    'Reply-To: '.$email.'' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
   
    $send_mail = @mail($to_email, $subject, 'Message sent via contact form '.$email , $headers); 
   
    if(!$send_mail)
    {
        //If mail couldn't be sent output error. Check your PHP email configuration (if it ever happens)
        $output = json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
        die($output);
    }else{
        $output = json_encode(array('type'=>'message', 'text' => 'Hi '.$name .'! Thank you for your email'));
        die($output);
    }
}
?>