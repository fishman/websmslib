/**
 *	WebSMS widget
 *
 *	© Claudio Procida 2006-2008
 *
 *	Disclaimer
 *
 *	The WebSMS Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not its author(s), assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 */

var Ajax = {
	update: function(params)
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == 4)
			{
				if (xmlhttp.status == 200)
				{
					if (params.target)
					{
						params.target.innerHTML = xmlhttp.responseText;
					}
				}
			}
		}
		xmlhttp.open('GET', params.url, true);
		xmlhttp.send(null);
	}
};