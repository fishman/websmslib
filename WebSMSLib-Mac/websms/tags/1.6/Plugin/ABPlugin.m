//
//  ABPlugin.m
//  ABPlugin
//
//  Created by delphine on 7-02-2006.
//  Copyright 2006 Emeraldion Lodge. All rights reserved.
//

#import "ABPlugin.h"
#import "Contact.h"

@implementation ABPlugin

/*********************************************/
// Methods required by the WidgetPlugin protocol
/*********************************************/

// This method is called when the widget plugin is first loaded as the
// widget's web view is first initialized

- (id)initWithWebView:(WebView *)webView
{
	self = [super init];
	contacts = [[NSMutableArray alloc] initWithCapacity:1];
	addressbook = [ABAddressBook sharedAddressBook];
	
	NSLog(@"ABPlugin initialized");
	
	return self;
}

- (void)dealloc
{
	[contacts release];
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
	[wso setValue:self forKey:@"ABPlugin"];
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
	else if (aSel == @selector(contactForIndex:))
	{
		return @"contactForIndex";
	}
	else if (aSel == @selector(numberForIndex:))
	{
		return @"numberForIndex";
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
		aSel == @selector(contactForIndex:) ||
		aSel == @selector(numberForIndex:))
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

// Carico i numeri dalla rubrica
- (void)loadContacts
{
	ABPerson *abContact;
	
	[contacts removeAllObjects];
	
	ABSearchElement *mobileSearch = [ABPerson searchElementForProperty:kABPhoneProperty label:kABPhoneMobileLabel
																   key:nil
																 value:@""
															comparison:kABNotEqual];
	NSArray *mobileResults = [addressbook recordsMatchingSearchElement:mobileSearch];
	
	NSEnumerator *enumerator = [mobileResults objectEnumerator];
	
	while (abContact = [enumerator nextObject])
	{
		NSString *name = [abContact valueForProperty:kABFirstNameProperty];
		if (!name)
		{
			name = @"";
		}
		NSString *lastname = [abContact valueForProperty:kABLastNameProperty];
		if (!lastname)
		{
			lastname = [abContact valueForProperty:kABOrganizationProperty];
			if (!lastname)
			{
				// giving up
				lastname = @"";
			}
		}
		
		ABMultiValue *phones = [abContact valueForProperty:kABPhoneProperty];
		if (phones) {
			int i;
			for (i = 0; i < [phones count]; i++)
			{
				NSString *label = [phones labelAtIndex:i];
				if ([label isEqualToString:kABPhoneMobileLabel])
				{
					Contact *contact = [[Contact alloc] initWithName:[NSString stringWithFormat:@"%@ %@", lastname, name] 
														   AndNumber:[phones valueAtIndex:i]];
					[contacts addObject:contact];
					[contact release];
				}
			}
		}
	}
	NSArray *sortedContacts = [contacts sortedArrayUsingSelector:@selector(caseInsensitiveCompare:)];
	contacts = [[NSMutableArray arrayWithArray:sortedContacts] retain];
}

//	Returns the number of results
- (int)count
{
	return [contacts count];
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


@end