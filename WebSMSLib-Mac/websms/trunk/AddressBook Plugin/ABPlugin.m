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
 *
 *  ABPlugin.m
 *  ABPlugin
 *
 *  Created by delphine on 7-02-2006.
 */

#import "ABPlugin.h"
#import "Contact.h"

static const NSString *ABPluginJSName = @"ABPlugin";

@implementation ABPlugin

/*********************************************/
// Methods required by the WidgetPlugin protocol
/*********************************************/

// This method is called when the widget plugin is first loaded as the
// widget's web view is first initialized

- (id)initWithWebView:(WebView *)webView
{
	if (self = [super init])
	{
		contacts = [[NSMutableArray alloc] initWithCapacity:1];
		passwordManager = [[PasswordManager alloc] init];
		NSLog(@"ABPlugin initialized");
	}
	return self;
}

- (void)dealloc
{
	[self setContacts:nil];
	[passwordManager release];
	[super dealloc];
}


/*********************************************/
// Methods required by the WebScripting protocol
/*********************************************/

// This method gives you the object that you use to bridge between the
// Obj-C world and the JavaScript world.  Use setValue:forKey: to give
// the object the name it's refered to in the JavaScript side.
- (void)windowScriptObjectAvailable:(WebScriptObject*)wso
{
	[wso setValue:self forKey:ABPluginJSName];
}

// This method lets you offer friendly names for methods that normally 
// get mangled when bridged into JavaScript.
+ (NSString *)webScriptNameForSelector:(SEL)aSel
{
	if (aSel == @selector(loadContacts))
	{
		return @"loadContacts";
	}
	else if (aSel == @selector(count))
	{
		return @"count";
	}
	else if (aSel == @selector(systemVersionString))
	{
		return @"systemVersionString";
	}
	else if (aSel == @selector(contactForIndex:))
	{
		return @"contactForIndex";
	}
	else if (aSel == @selector(numberForIndex:))
	{
		return @"numberForIndex";
	}
	else if (aSel == @selector(ownNumber))
	{
		return @"ownNumber";
	}
	else if (aSel == @selector(saveContact:number:))
	{
		return @"saveContactNumber";
	}
	else if (aSel == @selector(passwordForService:accountName:))
	{
		return @"passwordForServiceAccountName";
	}
	else if (aSel == @selector(setPassword:forService:accountName:))
	{
		return @"setPasswordForServiceAccountName";
	}
	else
	{
		NSLog(@"Error: unknown selector");
		return nil;
	}
}

// This method lets you filter which methods in your plugin are accessible 
// to the JavaScript side.
+ (BOOL)isSelectorExcludedFromWebScript:(SEL)aSel {  
	if (aSel == @selector(loadContacts) ||
		aSel == @selector(count) || 
		aSel == @selector(systemVersionString) || 
		aSel == @selector(ownNumber) || 
		aSel == @selector(contactForIndex:) ||
		aSel == @selector(numberForIndex:) ||
		aSel == @selector(saveContact:number:) ||
		aSel == @selector(setPassword:forService:accountName:) ||
		aSel == @selector(passwordForService:accountName:))
	{
		return NO;
	}
	return YES;
}

// Prevents direct key access from JavaScript.
+ (BOOL)isKeyExcludedFromWebScript:(const char*)key
{
	return YES;
}

#pragma mark -
#pragma mark Accessors

- (NSString *)ownNumber
{
	// Obtain a reference to the 
	ABPerson *me = [[ABAddressBook sharedAddressBook] me];
	if (me)
	{
		// Get the collection of phone numbers
		ABMultiValue *phones = [me valueForProperty:kABPhoneProperty]; 

		// Get the primary phone number
		id value = [phones valueAtIndex:[phones indexForIdentifier:[phones primaryIdentifier]]];

		return (NSString *)value;
	}
	return nil;
}

- (void)setContacts:(NSArray *)someContacts
{
	[contacts autorelease];
	contacts = [someContacts mutableCopy];
}

- (NSArray *)contacts
{
	return contacts;
}

// Load mobile numbers from the Address Book
- (void)loadContacts
{
	ABAddressBook *addressbook = [ABAddressBook sharedAddressBook];	
	ABPerson *abContact;

	// Empty contacts list
	[contacts removeAllObjects];
	
	// Create a search object for mobile numbers
	ABSearchElement *mobileSearch = [ABPerson searchElementForProperty:kABPhoneProperty
																 label:kABPhoneMobileLabel
																   key:nil
																 value:@""
															comparison:kABNotEqual];
	// Get matching results from the addressbook
	NSArray *mobileResults = [addressbook recordsMatchingSearchElement:mobileSearch];
	
	NSEnumerator *enumerator = [mobileResults objectEnumerator];
	
	while (abContact = [enumerator nextObject])
	{
		NSString *name = nil;
		
		NSString *firstname = [abContact valueForProperty:kABFirstNameProperty];
		if (!firstname)
		{
			firstname = @"";
		}
		NSString *lastname = [abContact valueForProperty:kABLastNameProperty];
		if (!lastname)
		{
			lastname = [abContact valueForProperty:kABOrganizationProperty];
			if (!lastname)
			{
				lastname = @"";
			}
		}
		name = [NSString stringWithFormat:([firstname length] && [lastname length]) ? @"%@ %@" : @"%@%@", lastname, firstname];
		
		ABMultiValue *phones = [abContact valueForProperty:kABPhoneProperty];
		if (phones) {
			int i;
			for (i = 0; i < [phones count]; i++)
			{
				NSString *label = [phones labelAtIndex:i];
				if ([label isEqualToString:kABPhoneMobileLabel])
				{
					[contacts addObject:[Contact contactWithName:name
														  number:[phones valueAtIndex:i]]];
				}
			}
		}
	}
	[self setContacts:[contacts sortedArrayUsingSelector:@selector(caseInsensitiveCompare:)]];
}

//	Returns the number of results
- (int)count
{
	return [contacts count];
}

- (void)saveContact:(NSString *)name number:(NSString *)number
{
	// Heuristic method to get last name and 
	NSArray *parts = [name componentsSeparatedByString:@" "];
	int len = [parts count];
	int half = len / 2;

	ABAddressBook *addressbook = [ABAddressBook sharedAddressBook];	
	
	ABPerson *person = [[ABPerson alloc] init];

	if (half > 0)
	{
		[person setValue:[[parts subarrayWithRange:NSMakeRange(0, half)] componentsJoinedByString:@" "]
			 forProperty:kABFirstNameProperty];
	}
	[person setValue:[[parts subarrayWithRange:NSMakeRange(half, len - half)] componentsJoinedByString:@" "]
		 forProperty:kABLastNameProperty];

	ABMutableMultiValue *phone = [[ABMutableMultiValue alloc] init];
	
	[phone addValue:number
		  withLabel:kABPhoneMobileLabel];

	[person setValue:phone
		 forProperty:kABPhoneProperty];
	// Cleanup
	[phone release];

	[addressbook addRecord:person];

	// Cleanup
	[person release];

	[addressbook save];
}

// Returns the contact for given index
- (NSString *)contactForIndex:(int)index
{
	return [[contacts objectAtIndex:index] description];
}

- (NSString *)numberForIndex:(int)index
{
	return [[contacts objectAtIndex:index] number];
}

- (void)setPassword:(NSString *)pass forService:(NSString *)srv accountName:(NSString *)acct
{
	[passwordManager setPassword:pass
					  forService:srv
					 accountName:acct];
}

- (NSString *)passwordForService:(NSString *)srv accountName:(NSString *)acct
{
	return [passwordManager passwordForService:srv
								   accountName:acct];
}

- (NSString *)systemVersionString
{
	NSString *ProductVersionString = @"ProductVersion:\t";
	
	// Launch /usr/bin/sw_vers and parse its output.
	// This command returns something like:
	//
	// maia:~ delphine$ /usr/bin/sw_vers
	// ProductName:    Mac OS X
	// ProductVersion: 10.4.11
	// BuildVersion:   8S165
	//
	// We are not using Gestalt() because it has a curious
	// bug, in that it keeps returning 0x1049 for 10.4.10
	// and later
	
	NSTask *task = [[[NSTask alloc] init] autorelease];
	[task setLaunchPath:@"/usr/bin/sw_vers"];

    NSPipe *newPipe = [NSPipe pipe];
    NSFileHandle *readHandle = [newPipe fileHandleForReading];
    NSData *inData = nil;
	NSMutableData *buffer = [NSMutableData data];
    // write handle is closed to this process
    [task setStandardOutput:newPipe];

	[task launch];
	[task waitUntilExit];

	while ((inData = [readHandle availableData]) && [inData length]) {
        [buffer appendData:inData];
    }
	
	NSString *str = [[[NSString alloc] initWithData:buffer
										   encoding:NSUTF8StringEncoding] autorelease];

	NSScanner *scanner = [NSScanner scannerWithString:str];
	NSString *systemVersionString;
	if ([scanner scanUpToString:ProductVersionString
					 intoString:NULL] &&		
		[scanner scanString:ProductVersionString
					intoString:NULL] &&
		[scanner scanUpToString:@"\n"
					 intoString:&systemVersionString])
	{
		return systemVersionString;
	}
	return nil;
}

@end