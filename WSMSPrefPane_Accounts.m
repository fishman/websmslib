//
//  WSMSPrefPane_Accounts.m
//  websmslib
//
//  Created by malcom on 9/4/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WSMSPrefPane_Accounts.h"
#import "AccountsSubViewController.h"
#import "WebSMSApp.h"
#import "WSMS_PrefsController.h"
#import "TestClass.h"

@implementation WSMSPrefPane_Accounts

- (NSMutableArray *) subviewControllers
{
    if (subviewControllers == nil)
    {
        subviewControllers = [[NSMutableArray alloc] init];
    }
    
    return subviewControllers;
}

- (void) reloadPreferences {
	NSArray *list = [[WebSMSAppManager sharedManager] getAllAccounts];
	
	[[self subviewControllers] removeAllObjects];
	int k;
	for (k=0; k < [list count]; k++) {
		NSDictionary *_acData = [list objectAtIndex: k];
		[[self subviewControllers] addObject: [[[AccountsSubViewController alloc] initWithAccountData: _acData] autorelease]];
    }
	
	[tableViewController reloadTableView];
}

- (void) awakeFromNib {
	// Creating the SubviewTableViewController
	NSTableColumn *tb = [[subviewTableView tableColumns] objectAtIndex:0];
    tableViewController = [[SubviewTableViewController controllerWithViewColumn: tb] retain];
    [tableViewController setDelegate: self];
	[subviewTableView setDoubleAction: @selector(_doubleClickAccount:)];
	
	[self reloadPreferences];
}

- (void) _loadProvidersList {
	[edit_btn_serviceProvider removeAllItems];
	NSArray *_services = [[WebSMSPluginManager sharedManager] pluginServices];
	[edit_btn_serviceProvider addItemsWithTitles: _services];
	
	int k;
	for (k=0; k < [[edit_btn_serviceProvider itemArray] count]; k++) {
		WebSMSPlugin *_plug = [[[WebSMSPluginManager sharedManager] getPluginWithName: [[edit_btn_serviceProvider itemAtIndex:k] title]] retain];		
		NSData *icon = [_plug serviceIcon];
		[[edit_btn_serviceProvider itemAtIndex: k] setImage: (icon == nil ? [NSImage imageNamed: @"standard_plugin"] :
															  [[[NSImage alloc] initWithData: icon] autorelease])];
		[_plug release];
	}	
}

- (void) _loadAccountAtIndex:(int) sel {
	[self _loadProvidersList];
	
	if (sel == -1) {
		[edit_fld_accountName setStringValue: @""];
		[edit_fld_username setStringValue: @""];
		[edit_fld_password setStringValue: @""];
		[edit_btn_serviceProvider selectItemAtIndex: 0];
		_isNewAccount = YES;
	} else {
		// fillup data
		NSDictionary *_acc = [[subviewControllers objectAtIndex: sel] accountsData];
		[edit_fld_accountName setStringValue: [_acc objectForKey: _plugin_auth_accountname]];
		[edit_fld_username setStringValue: [_acc objectForKey: _plugin_auth_user]];
		[edit_fld_password setStringValue: [_acc objectForKey: _plugin_auth_pass]];
		[edit_btn_serviceProvider selectItemWithTitle: [_acc objectForKey: _plugin_auth_plugin]];
		_isNewAccount = NO;
	}

	[NSApp beginSheet: wnd_accountDetails 
			modalForWindow: [[WSMS_PrefsController sharedPrefsWindowController] window]
			modalDelegate:self 
			didEndSelector:NULL 
			contextInfo:nil];
}

// Methods from SubviewTableViewControllerDataSourceProtocol

- (NSView *) tableView:(NSTableView *) tableView viewForRow:(int) row
{
    return [[[self subviewControllers] objectAtIndex: row] view];
}

// Methods from NSTableViewDelegate category

- (void) tableViewSelectionDidChange:(NSNotification *) notification
{
}

// Methods from NSTableDataSource protocol

- (int) numberOfRowsInTableView:(NSTableView *) tableView
{
    return [[self subviewControllers] count];
}

- (id) tableView:(NSTableView *) tableView objectValueForTableColumn:(NSTableColumn *) tableColumn row:(int) row
{
    id obj = nil;
    
    if (tableColumn == rowNumberTableColumn)
    {
        obj = [NSNumber numberWithInt: row];
    }
    
    return obj;
}

- (IBAction) btn_editAccount:(id) sender {
	[self _loadAccountAtIndex: [subviewTableView selectedRow]];
}

- (IBAction) btn_addAccount:(id) sender {
	[self _loadAccountAtIndex:-1];
}

- (IBAction) btn_removeAccount:(id) sender {
	int sel = [subviewTableView selectedRow];
	if (sel > -1) {
		[[WebSMSAppManager sharedManager] removeAccountNamed: 
			[[[subviewControllers objectAtIndex:sel] accountsData] objectForKey: _plugin_auth_accountname]];
		[self reloadPreferences];
		[[TestClass sharedMainClass] reloadSettingsPreferences];
	}
}


- (IBAction) edit_btn_ok:(id) sender {
	if ([[edit_fld_accountName stringValue] length] > 0 && 
		[[edit_fld_username stringValue] length] > 0 &&
		[[edit_fld_password stringValue] length]) {
	
		if (!_isNewAccount) {
			int sel = [subviewTableView selectedRow];
			// remove account
			[[WebSMSAppManager sharedManager] removeAccountNamed: 
				[[[subviewControllers objectAtIndex:sel] accountsData] objectForKey: _plugin_auth_accountname]];
		}
		
		// add new one
		[[WebSMSAppManager sharedManager] saveUsername: [edit_fld_username stringValue] 
												andPass: [edit_fld_password stringValue]
												toAccountNamed: [edit_fld_accountName stringValue] 
									   forPluginNamed:[edit_btn_serviceProvider titleOfSelectedItem]];
		[self _closeAccountsSheet];
	} else NSBeep();
}

- (IBAction) edit_btn_cancel:(id) sender {
	[self _closeAccountsSheet];
}

- (void) _closeAccountsSheet {
	[NSApp endSheet: wnd_accountDetails];
	[wnd_accountDetails orderOut:nil];
	[self reloadPreferences];
	[[TestClass sharedMainClass] reloadSettingsPreferences];
}

@end
