//
//  WSMSABPopUpButton.m
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WSMSABPopUpButton.h"
#import "WebSMSApp.h"

@implementation WSMSABPopUpButton

- (void) reloadAddressBook {
	[self removeAllItems];
	
	_menu = [[NSMenu alloc] initWithTitle:@"Principale"];
	
	NSMenuItem *subMenuRec = [[NSMenuItem alloc] initWithTitle: @"Recently Used" action: @selector(_selectName:) keyEquivalent: @""];
	[subMenuRec setTarget: self];
	[subMenuRec setEnabled: YES];
	[subMenuRec setSubmenu: [self _getRecentlyUsedMenu]];
	
	NSMenuItem *subMenuAB = [[NSMenuItem alloc] initWithTitle: @"Address Book" action: @selector(_selectName:) keyEquivalent: @""];
	[subMenuAB setTarget: self];
	[subMenuAB setEnabled: YES];
	[subMenuAB setSubmenu: [self _getAddressBook]];
	
	NSMenuItem *refresh = [[NSMenuItem alloc] initWithTitle: @"Refresh..." action: @selector(reloadAddressBook) keyEquivalent: @""];
	[refresh setTarget: self];
	[refresh setEnabled: YES];

	[_menu addItemWithTitle: @"Select destination" action: nil keyEquivalent: @""];
	[_menu addItem: [subMenuRec autorelease]];
	[_menu addItem: [subMenuAB autorelease]];
	[_menu addItem: [NSMenuItem separatorItem]];

	NSMenuItem *otherNumber = [[NSMenuItem alloc] initWithTitle: @"Other Number..." action: @selector(_changeOtherNumber:) keyEquivalent: @""];
	[otherNumber setTarget: self];
	[otherNumber setEnabled: YES];
	[_menu addItem: [otherNumber autorelease]];

	[_menu addItem: [refresh autorelease]];

	
	[self setMenu: _menu];
}


- (void) _changeOtherNumber:(id) sender {
	[_delegate wsms_abpop_otherNumberMenu];
}

- (NSMenu *) _getRecentlyUsedMenu {
	NSMenu *_recently = [[NSMenu alloc] initWithTitle:@"Recenti"];
	
	NSArray *lista = [[WebSMSAppManager sharedManager] getRecentDestinations];
	
	if ([lista count] == 0) {
		NSMenuItem *recItem = [[NSMenuItem alloc] initWithTitle: @"No Recently Items" action: NULL keyEquivalent:@""];
		[_recently addItem: [recItem autorelease]];
		[recItem setEnabled: NO];
	} else {
		int k;
		for (k=0; k < [lista count]; k++) {
			NSDictionary *rItem = [lista objectAtIndex:k];
			NSMenuItem *recItem = [[NSMenuItem alloc] initWithTitle: [NSString stringWithFormat: @"%@ (%@)",
																  [rItem objectForKey: people_data_name],
																   [rItem objectForKey: people_data_phone]]
														action: @selector(_selectName:) keyEquivalent: @""];
			[recItem setTarget: self];
			[recItem setRepresentedObject: rItem];
			[_recently addItem:recItem];
			[recItem autorelease];
		}
	}
	return [_recently autorelease];
}

- (NSMenu *) _getAddressBook {
	NSMenu *_abBookList = [[NSMenu alloc] initWithTitle:@"Ab"];
    ABAddressBook *book = [ABAddressBook sharedAddressBook];
	
	NSArray *list = [book people];
	int k;
	for (k=0; k< [list count]; k++) {
		ABPerson *people = [list objectAtIndex: k];
		NSString *_name = [NSString stringWithFormat: @"%@ %@",
									[people valueForProperty:kABFirstNameProperty],
						   ([[people valueForProperty:kABLastNameProperty] length] > 0 ?
							[people valueForProperty:kABLastNameProperty] : @"")];
		
		// search inside user's numbers
		//#define TELEPHONE_PROPS [NSArray arrayWithObjects: kABPhoneWorkLabel,kABPhoneHomeLabel,kABPhoneMobileLabel,kABPhoneMainLabel,nil]
		ABMultiValue *telephones = [people valueForProperty: kABPhoneProperty];
		int j;
		for (j =0 ; j < [telephones count]; j++) {
			NSString *_val = [telephones valueAtIndex: j];
			if (_val != nil) {
				NSMenuItem *peopleItem = [[NSMenuItem alloc] initWithTitle: [NSString stringWithFormat: @"%@ (%@)",_name,_val]
														action: @selector(_selectName:) keyEquivalent: @""];
				[peopleItem setTarget: self];
				[peopleItem setRepresentedObject: [NSDictionary dictionaryWithObjectsAndKeys: _name,people_data_name,_val,people_data_phone,nil,nil]];
		
				[_abBookList addItem: [peopleItem autorelease]];
			}
		}
	}
	return [_abBookList autorelease];
}

- (void) _selectName:(id) sender {
	[_delegate wsms_abpop_selectedPeopleData: [sender representedObject]];
}

- (void) setDelegate:(NSObject <WSMSABPopUpButton_Protocol> *) _del {
	[_delegate release];
	_delegate = [_del retain];
}

- (void) dealloc
{
	[_delegate release];
	[_menu release];
	[super dealloc];
}


@end
