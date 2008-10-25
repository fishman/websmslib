//
//  WSMSProvPopUpButton.m
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WSMSProvPopUpButton.h"
#import "WebSMSApp.h"

@implementation WSMSProvPopUpButton

- (void) reloadProvidersList {
	NSArray *prov = [[WebSMSAppManager sharedManager] getAllAccounts];
	[_menu release];
	_menu = [[NSMenu alloc] initWithTitle:@"Menu"];
	
	int k;
	for (k=0; k < [prov count]; k++) {
		NSDictionary *_accountData = [prov objectAtIndex: k];
		//WebSMSPlugin *_plug = [[WebSMSPluginManager sharedManager] getPluginWithName: [_accountData objectForKey: _plugin_auth_plugin]];
		NSMenuItem *it = [[NSMenuItem alloc] initWithTitle: [_accountData objectForKey: _plugin_auth_accountname]
													action: @selector(_selectPlugin:)
											 keyEquivalent: @""];
		[it setTarget: self];
		[it setRepresentedObject: _accountData];
		[_menu addItem: [it autorelease]];
	}
	
	[self removeAllItems];
	[self setMenu: _menu];
}

- (void) dealloc
{
	[_menu release];
	[super dealloc];
}

- (void) _selectPlugin:(id) sender {
	NSLog(@"Plugin: %@",[[sender representedObject] description]);
}

@end
