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

SkinClasses = {
	blue: "",
	red: "red",
	yellow: "yellow",
	white: "white",
	green: "green",
	purple: "purple"
};
	
SkinChooser = {
	updateWithSkin: function(skin)
	{
		var styles = document.getElementById("skinchooser").getElementsByTagName("img");
		var index = 0;
		for (var i = 0; i < styles.length; i++)
		{
			if (styles[i].id.indexOf(skin) == 0)
				index = i;
			styles[i].src = styles[i].src.replace("-on", "-off");
		}
		styles[index].src = styles[index].src.replace("-off", "-on");		
	},
	setSkin: function(el)
	{
		var styles = el.parentNode.getElementsByTagName("img");
		for (var i = 0; i < styles.length; i++)
		{
			if (styles[i] != el)
			{
				styles[i].src = styles[i].src.replace("-on", "-off");
			}
		}
		el.src = el.src.replace("-off", "-on");
		phone.setSkin(el.id.substringToString("-"));
	}
};