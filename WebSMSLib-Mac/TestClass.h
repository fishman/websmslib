//
//  TestClass.h
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "WebSMSApp.h"
#import "WSMS_PrefsController.h"
#import "MAAttachedWindow.h"
#import "CustomView.h"
#import <HMBlkAppKit/HMBlkAppKit.h>
#import "DKPopUpButton.h"
#import "WSMSABPopUpButton.h"
#import "WSMSProvPopUpButton.h"
#import <AddressBook/AddressBook.h>
#import "ActivityMonitorController.h"
#import <Sparkle/Sparkle.h>

@interface TestClass : NSObject  <WSMSABPopUpButton_Protocol, hudPanelResponder_Protocol, WebSMSEngine_Protocol,MCDebug_DelegateProtocol> {
				WebSMSEngine					*msg_engine;
	IBOutlet	SUUpdater						*_updateEngine;
	
				NSStatusItem					*statusItem;
				MAAttachedWindow				*attachedWindow;
	IBOutlet	NSView							*view;
	IBOutlet	NSWindow						*about_window;
	IBOutlet	NSTextField						*about_version;

	IBOutlet	NSTextView						*hud_fld_messageText;
	IBOutlet	WSMSProvPopUpButton				*hud_listServices;
	IBOutlet	WSMSABPopUpButton				*hud_addressBook;
	IBOutlet	NSTextField						*hud_fld_otherNumber;
	IBOutlet	NSButton						*hud_btn_switchToAB;
	
	IBOutlet	NSView							*_view_currentPickerView;
	IBOutlet	NSView							*_view_addressBookMenu;
	IBOutlet	NSView							*_view_manualOtherNumber;

	IBOutlet	NSView							*_view_centralMainView;
	IBOutlet	NSView							*_view_composeMessage;
	IBOutlet	NSView							*_view_sendingMessage;
	IBOutlet	NSView							*_view_sendResult;

	IBOutlet	NSButton						*hud_btn_sendButton;
	IBOutlet	NSTextField						*hud_fld_statusField;
	IBOutlet	NSTextField						*hud_fld_subStatusField;

	IBOutlet	NSTextField						*hud_fld_statField;
	IBOutlet	HMBlkProgressIndicator			*hud_prog_statusIndicator;
	IBOutlet	NSImageView						*hud_img_captchaCode;
	IBOutlet	NSTextField						*hud_fld_captchaUser;
	IBOutlet	NSButton						*hud_btn_abort;
	
	IBOutlet	NSImageView						*hud_img_resultIcon;
	IBOutlet	NSTextField						*hud_fld_resultMessage;
	IBOutlet	NSTextField						*hud_fld_resultDestination;
	
	IBOutlet	NSPopUpButton					*hud_btn_options;
	
	
	NSDictionary								*param_selectedDestination;
	BOOL										_manualDesInsert;

}

- (void)loadStatusMenuItem;
+ (TestClass *) sharedMainClass;

- (IBAction) hud_btn_send:(id) sender;
- (IBAction) hud_btn_okStartAgain:(id) sender;
- (IBAction) hud_btn_abortContinue:(id) sender;
- (IBAction) btn_optionsMenu_selected:(id) sender;

- (IBAction) _btn_toggleDestinationPicker:(id) sender;
- (void) _resetUIToEnableSend:(BOOL) _en;
- (void) _setupHUDWindow;
- (void) _showResultPanelAsError:(BOOL) _err withTitle:(NSString *) _title andMessage:(NSString *) _msg;
- (void) reloadSettingsPreferences;

- (void) _enableCheckSpelling:(BOOL) _en;

@end
