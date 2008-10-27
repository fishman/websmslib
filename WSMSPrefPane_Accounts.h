//
//  WSMSPrefPane_Accounts.h
//  websmslib
//
//  Created by malcom on 9/4/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "SubviewTableViewController.h"

@interface WSMSPrefPane_Accounts : NSObject < SubviewTableViewControllerDataSourceProtocol> {
	IBOutlet NSTableView					*subviewTableView;
    IBOutlet NSTableColumn					*rowNumberTableColumn;
    IBOutlet NSTableColumn					*subviewTableColumn;
	IBOutlet NSView							*view_accountsView;
	
	IBOutlet NSWindow						*wnd_accountDetails;
	
	SubviewTableViewController				*tableViewController;
    NSMutableArray							*subviewControllers;
	
	// ACCOUNT DETAILS
	IBOutlet NSPopUpButton					*edit_btn_serviceProvider;
	IBOutlet NSTextField					*edit_fld_accountName;
	IBOutlet NSTextField					*edit_fld_username;
	IBOutlet NSTextField					*edit_fld_password;
	
	BOOL _isNewAccount;
}

- (NSMutableArray *) subviewControllers;
- (void) reloadPreferences;

- (IBAction) btn_editAccount:(id) sender;
- (IBAction) btn_addAccount:(id) sender;
- (IBAction) btn_removeAccount:(id) sender;

- (IBAction) edit_btn_ok:(id) sender;
- (IBAction) edit_btn_cancel:(id) sender;

- (void) _closeAccountsSheet;
- (void) _loadProvidersList;
- (void) _loadAccountAtIndex:(int) sel;

@end
