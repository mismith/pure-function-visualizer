<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Whip</title>
	<link rel="stylesheet" href="assets/css/style.css" type="text/css">
	<link rel="stylesheet" href="assets/css/jquery.whiplink.css" type="text/css">
</head>
<body>



<table>
	<tr>
		<td><div class="start"></div></td>
		<td><div class="end"></div></td>
	</tr>
	<tr>
		<td><div class="start"></div></td>
		<td><div class="end"></div></td>
	</tr>
	<tr>
		<td><div class="start"></div></td>
		<td><div class="end"></div></td>
	</tr>
	<tr>
		<td><div class="start"></div></td>
		<td><div class="end"></div></td>
	</tr>
</table>


<table id="any">
	<tr>
		<td>&nbsp;</td>
		<td><div class="any"></div></td>
		<td><div class="any"></div></td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td><div class="any"></div></td>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td><div class="any"></div></td>
	</tr>
	<tr>
		<td><div class="any"></div></td>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td><div class="any"></div></td>
	</tr>
	<tr>
		<td>&nbsp;</td>
		<td><div class="any"></div></td>
		<td><div class="any"></div></td>
		<td>&nbsp;</td>
	</tr>
</table>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<script src="assets/js/jquery.whiplink.js"></script>
<script>
$(function(){
	$('.start').whiplink('.end', {handles:true});
	$('.any').whiplink({maxFromSolo:0, maxToSolo:0, handles:true, customClass:'arrow'});
});
</script>

</body>
</html>