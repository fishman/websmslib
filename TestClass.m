//
//  TestClass.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "TestClass.h"
#import "AGRegex.h"
#import "CustomView.h"
#import "NSView+Fade.h"

id _sharedMainClass;

@implementation TestClass

+ (TestClass *) sharedMainClass {
	if (! _sharedMainClass )
        [[self alloc] init];
    return _sharedMainClass;
}

- (id) init {
    if ( _sharedMainClass ) {
        [self dealloc];
        return nil;
    } else {
		self = [super init];
		_sharedMainClass = self;
		_captchaCodeCache = [[NSMutableDictionary alloc] init];
		
		BOOL _whiteStyle = [[[NSUserDefaults standardUserDefaults] objectForKey:@"Style"] isEqualToString:@"white"];
		//_whiteStyle = YES;
		_styleColor = (_whiteStyle ? [[NSColor colorWithCalibratedWhite:0.6 alpha:0.98] retain] : 
										[[NSColor colorWithCalibratedWhite:0.1 alpha:0.95] retain]);

		return _sharedMainClass;
    }
}


- (void) addToLogView:(NSString *) aFormat, ... {
	va_list argList;
	NSString *formattedString;

	va_start(argList, aFormat);
	formattedString = [[NSString alloc] initWithFormat: aFormat arguments: argList];
	va_end(argList);
	NSCalendarDate *date = [NSCalendarDate date];
	NSString *log = [NSString stringWithFormat: @"[%@]: %@\n",[date dateWithCalendarFormat:@"%H:%M:%S" timeZone:nil],formattedString];
	
	NSLog(@"%@",log);
	//[[ActivityMonitorController sharedUIActivityMonitor] addNewLog: log];
	
	[formattedString release];
}

- (void) awakeFromNib {
	[self loadStatusMenuItem];
	
	[[MCDebug sharedDebug] setDelegate: self];	
	[[MCDebug sharedDebug] setDebugON: [[[NSUserDefaults standardUserDefaults] objectForKey: @"debug_mode"] boolValue]];
	
	[hud_fld_otherNumber setDelegate: self];
	[hud_fld_messageText setDelegate: self];

	/*NSString *src = [[NSString alloc] initWithContentsOfFile: @"/Users/malcom/Desktop/source.txt"];
	NSString *patt = [[NSString alloc] initWithContentsOfFile: @"/Users/malcom/Desktop/regexp.txt"];
	AGRegex *rg = [[AGRegex alloc]initWithPattern: patt];
	NSLog(@"%@",[rg findAllInString:src]);*/
}

- (void)controlTextDidEndEditing:(NSNotification *)aNotification{
	if ([aNotification object] == hud_fld_otherNumber) {
		// if link between account and number is enabled then we will choose the last used account
		NSString *_bestAccount = [[WebSMSAppManager sharedManager] getAccountNameForNumber: [hud_fld_otherNumber stringValue]];
		if (_bestAccount != nil) [hud_listServices selectItemWithTitle: _bestAccount];
	}
}

- (BOOL)textView:(NSTextView *)textView  shouldChangeTextInRange:(NSRange)affectedCharRange  replacementString:(NSString *)replacementString {
	int len = [[hud_fld_messageText string] length];
	//need optimization here...?
	NSDictionary *accountData =  [[hud_listServices selectedItem] representedObject];
	WebSMSPlugin *choosedPlugin = [[WebSMSPluginManager sharedManager] getPluginWithName: [accountData objectForKey: _plugin_auth_plugin]];
	[hud_fld_statField setStringValue: [NSString stringWithFormat: NSLocalizedStringFromTable(@"UI_RemainingChars",@"Dialogs",@""),
										[choosedPlugin maxCharsAllowed]-len]];
														
	return YES;
}


- (void) websms_requestPreviousSessionCaptchaCodeForAccount:(NSString *) _account from:(WebSMSEngine *) engine {
//	NSLog(@"Last captcha is %@",[_captchaCodeCache objectForKey: _account]);
	[msg_engine setCaptchaCode: [_captchaCodeCache objectForKey: _account]];
	[msg_engine send];
}

- (IBAction) hud_btn_abortContinue:(id) sender {
	if ([hud_img_captchaCode isHidden] == NO) {
	//	NSLog(@"Saving in cache captcha for %@",[[msg_engine getPlugin] accountName]);
		[_captchaCodeCache setObject: [hud_fld_captchaUser string] forKey: [[msg_engine getPlugin] accountName]];

		[msg_engine setCaptchaCode: [hud_fld_captchaUser string]];
		[msg_engine send];
		
		[hud_img_captchaCode setHidden: YES withFade: YES];
		[hud_btn_arrow setHidden: YES withFade:YES];
		[hud_img_captchaCode setImage: nil];
		[hud_fld_captchaUser setHidden: YES];
		[[hud_fld_captchaUser enclosingScrollView] setHidden: YES];

		[hud_fld_captchaUser setString: @""];
		
		[hud_prog_statusIndicator setIndeterminate: NO];
		[hud_prog_statusIndicator stopAnimation: nil];
		
	} else {
		[msg_engine abortNow];
	}
}

- (IBAction) hud_btn_okStartAgain:(id) sender {
	[_view_centralMainView exchangeView: _view_sendResult withView:_view_composeMessage];
	//[_view_centralMainView setNeedsDisplay: YES];
	[attachedWindow makeFirstResponder: hud_fld_messageText];
	[hud_fld_messageText setSelectedRange: NSMakeRange(0,[[hud_fld_messageText string] length])];
}

- (void) _resetUIToEnableSend:(BOOL) _en {
	
	[hud_listServices setEnabled: _en];
	[hud_addressBook setEnabled: _en];
	[hud_addressBook setTitle: [param_selectedDestination objectForKey: people_data_phone]];
	[hud_btn_switchToAB setEnabled: _en];
	[hud_fld_otherNumber setEnabled:_en];
	
	if (!_en) [hud_prog_statusIndicator startAnimation: nil];
	else [hud_prog_statusIndicator stopAnimation: nil];

	[hud_prog_statusIndicator setIndeterminate: NO];
	[hud_prog_statusIndicator setMinValue: 0.0];
	[hud_prog_statusIndicator setDoubleValue: 0.0];
	
	[hud_img_captchaCode setHidden: YES];
	[hud_fld_captchaUser setHidden: YES];
	[[hud_fld_captchaUser enclosingScrollView] setHidden: YES];

	[hud_btn_arrow setHidden: YES];

	
	[hud_btn_abort setTitle: NSLocalizedStringFromTable(@"UI_Abort",@"Dialogs",@"")];

}

- (void) debug_dataReceived:(NSString *) _data {
	NSString *log = [NSString stringWithFormat: @"[%@]: %@\n",[[NSCalendarDate date] dateWithCalendarFormat:@"%H:%M:%S" timeZone:nil],_data];
	[[ActivityMonitorController sharedUIActivityMonitor] addNewLog: log];//[log sanitizeString: [msg_engine replacements]]];
	NSLog(@"%@",log);
}


- (void)loadStatusMenuItem
{
 // Create an NSStatusItem.
    float width = 30.0;
    float height = [[NSStatusBar systemStatusBar] thickness];
    NSRect viewFrame = NSMakeRect(0, 0, width, height);
    statusItem = [[[NSStatusBar systemStatusBar] statusItemWithLength:width] retain];
    [statusItem setView: [[[CustomView alloc] initWithFrame:viewFrame controller:self] autorelease]];
}


- (void) wsms_abpop_selectedPeopleData:(NSDictionary *) _people {
	[hud_addressBook setTitle: [NSString stringWithFormat: @"%@ (%@)",
									[_people objectForKey: people_data_name],
									[_people objectForKey: people_data_phone]]];
	[param_selectedDestination release];
	
	// if link between account and number is enabled then we will choose the last used account
	NSString *_bestAccount = [[WebSMSAppManager sharedManager] getAccountNameForNumber: [_people objectForKey: people_data_phone]];
	if (_bestAccount != nil) [hud_listServices selectItemWithTitle: _bestAccount];
		
	param_selectedDestination = [_people retain];
}

- (void) wsms_abpop_otherNumberMenu {
	[self _btn_toggleDestinationPicker: nil];
	[attachedWindow makeFirstResponder: hud_fld_otherNumber];
}

- (IBAction) _btn_toggleDestinationPicker:(id) sender {
	NSView *_toHide = nil;
	NSView *_toShow = nil;
	if ([[_view_currentPickerView subviews] objectAtIndex: 0] == _view_addressBookMenu ) {
		_toHide = _view_addressBookMenu;
		_toShow = _view_manualOtherNumber;
		[hud_fld_otherNumber setStringValue: (param_selectedDestination != nil ? [param_selectedDestination objectForKey: people_data_phone] : @"")];
		_manualDesInsert = YES;
	} else {
		_toHide = _view_manualOtherNumber;
		_toShow = _view_addressBookMenu;
		_manualDesInsert = NO;
	}
	[_view_currentPickerView exchangeView: _toHide withView: _toShow];
}

- (void) reloadSettingsPreferences {
		// reload address book
	[hud_addressBook reloadAddressBook];
	[hud_addressBook setDelegate: self];
	
	// reload service providers
	[hud_listServices reloadProvidersList];
}

- (void) _setupHUDWindow {
	// if main view is not loaded (first launch) we will create it without any toggle
	if ([[_view_currentPickerView subviews] count] == 0) {
		[_view_currentPickerView addSubview: _view_addressBookMenu]; // address book picker
		[_view_centralMainView addSubview: _view_composeMessage]; // compose view
	}
	
	// appareance
	[hud_fld_messageText setBackgroundColor: [attachedWindow backgroundColor]];
	[hud_fld_messageText setTextColor: [NSColor whiteColor]];
	[hud_fld_messageText setFont: [NSFont systemFontOfSize: 11.0]];
	[hud_fld_messageText setContinuousSpellCheckingEnabled: NO];
	[hud_fld_otherNumber setBackgroundColor:[attachedWindow backgroundColor]];
	
	[self reloadSettingsPreferences];
	
	[hud_btn_options removeAllItems];
	
	
	// configure options menu
	NSMenu *opMenu = [[[NSMenu alloc] init] autorelease];
	NSArray *list =[NSLocalizedStringFromTable(@"UI_OptionsMenu",@"Dialogs",@"") componentsSeparatedByString:@","];
	int k;
	for (k=0; k < [list count];k++) {
		if ([[list objectAtIndex: k] isEqualToString:@"-"]) {
			[opMenu addItem: [NSMenuItem separatorItem]];
		} else {
			NSMenuItem *item = [[NSMenuItem alloc] initWithTitle: [list objectAtIndex: k] 
														  action:@selector(btn_optionsMenu_selected:)
												   keyEquivalent:@""];
			[item setTarget: self];
			[opMenu addItem: [item autorelease]];
		}
	}
	[hud_btn_options setMenu: opMenu];
}

- (void)toggleAttachedWindowAtPoint:(NSPoint)pt
{
    // Attach/detach window.
    if (!attachedWindow) {
        attachedWindow = [[MAAttachedWindow alloc] initWithView:view 
                                                attachedToPoint:pt 
                                                       inWindow:nil 
                                                         onSide:MAPositionBottom 
                                                     atDistance:5.0];

		[attachedWindow setBackgroundColor: _styleColor];
		[self _setupHUDWindow];
		
		[attachedWindow setOpaque:NO];
		[NSApp activateIgnoringOtherApps: YES];

        [attachedWindow makeKeyAndOrderFront:self];
		
		
		[attachedWindow setAlphaValue:0.0];
		[[attachedWindow contentView] lockFocus];
		[attachedWindow setAlphaValue:1.0 fadeTime:0.2];
		[[attachedWindow contentView] unlockFocus];

		[attachedWindow makeKeyAndOrderFront:self];
		
		[hud_fld_messageText setString: NSLocalizedStringFromTable(@"UI_Compose_Message",@"Dialogs",@"")];
		[attachedWindow makeFirstResponder: hud_fld_messageText];
		[hud_fld_messageText setSelectedRange: NSMakeRange(0,[[hud_fld_messageText string] length])];
		

  } else {
        [attachedWindow orderOut:self];
        [attachedWindow release];
        attachedWindow = nil;
    }    
}

- (void) _enableCheckSpelling:(BOOL) _en {
	[hud_fld_messageText setContinuousSpellCheckingEnabled: _en];
}

- (IBAction) hud_btn_send:(id) sender {	
	// prepare data
	NSDictionary *accountData =  [[hud_listServices selectedItem] representedObject];
	WebSMSPlugin *choosedPlugin = [[WebSMSPluginManager sharedManager] getPluginWithName: [accountData objectForKey: _plugin_auth_plugin]];
	[choosedPlugin setAccountName: [hud_listServices titleOfSelectedItem]];
	WebSMSData *data = [[[WebSMSData alloc] initWithUsername: [accountData objectForKey: _plugin_auth_user]
												 andPassword: [accountData objectForKey: _plugin_auth_pass]] autorelease];
	
	// set country code
	if ([[NSUserDefaults standardUserDefaults] objectForKey: @"country"] != nil) {
		NSDictionary *dic = [[NSDictionary alloc] initWithContentsOfFile: 
						 [NSString stringWithFormat: @"%@/%@",[[NSBundle mainBundle] resourcePath], @"ccountries.plist"]];
	
		[data setCountryCode: [[dic objectForKey: [[NSUserDefaults standardUserDefaults] objectForKey: @"country"]] intValue]];
	}
							   
	if (_manualDesInsert) { // if manual insert we will save the value
		if ([[hud_fld_otherNumber stringValue] length] > 0) { // ok we have destination number
			[param_selectedDestination release];
			param_selectedDestination = [[NSDictionary alloc] initWithObjectsAndKeys: [hud_fld_otherNumber stringValue],people_data_phone,@"Unknown",people_data_name,nil,nil];
		} else { // damn.. you have missed your destination number
			[param_selectedDestination release];
			param_selectedDestination = nil;
		}
	}
	
	// ok we are missing something (probability manual entry for destination... damn!)
	if (param_selectedDestination == nil) {
		NSBeep();
		return;
	}
	
	//eu33117805@tele2.it : 6W8-PB8 | lunatica1740 : 191185

	// add to recently items
	[[WebSMSAppManager sharedManager] addToRecentsDestinations: param_selectedDestination];
	[hud_addressBook reloadAddressBook];
	
	// save link (only if prefs are enabled)
	[[WebSMSAppManager sharedManager] saveLinkBetweenNumber: [param_selectedDestination objectForKey: people_data_phone]
											 andAccountName: [accountData objectForKey: _plugin_auth_accountname]];
	
	// prepare message
	WebSMSMessage *message = [[[WebSMSMessage alloc] initWithMessageBody: [hud_fld_messageText string] 
																   from: @""
																	 to: [param_selectedDestination objectForKey: people_data_phone]] autorelease];
	[data setMessage: message];
	
	// alloc engine
	[msg_engine release]; msg_engine = nil;
	msg_engine = [[WebSMSEngine alloc] init];
	[msg_engine setDelegate: self];
	[msg_engine setPlugin: choosedPlugin];
	[msg_engine setMessageData: data];
	
	// debug
	//[engine setEnablePageWriteBack: ([btn_enable_writeBack state] == NSOnState ? YES: NO)];
	// console
//	[[MCDebug sharedDebug] setDebugON: ([btn_enable_debug state] == NSOnState ? YES: NO)];
	// start
	
	// start
	[hud_prog_statusIndicator setIndeterminate: YES];
	[hud_prog_statusIndicator setUsesThreadedAnimation: YES];
	[hud_prog_statusIndicator startAnimation: nil];
	
	[hud_fld_statusField setStringValue: [NSString stringWithFormat: 
											NSLocalizedStringFromTable(@"Sending_Start",@"Dialogs",@""),
											 [[msg_engine getPlugin] name] ]];
	[hud_fld_subStatusField setStringValue:@""];

	[_view_centralMainView exchangeView: _view_composeMessage withView:_view_sendingMessage];
	[msg_engine send];
	
}

- (IBAction) btn_optionsMenu_selected:(id) sender {
	int sel = [hud_btn_options indexOfSelectedItem];
	[hud_btn_options selectItemAtIndex: 0];
	switch (sel) {
		case 1: // PREFERENCES
			[[WSMS_PrefsController sharedPrefsWindowController] showWindow:nil];
			break;
		case 2: // ACTIVITY MONITOR
			[[ActivityMonitorController sharedUIActivityMonitor] openWindow];
			break;
			
		case 4: // ABOUT
			[about_version setStringValue: [NSString stringWithFormat: NSLocalizedStringFromTable(@"UI_About",@"Dialogs",@""),[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"]]];
			[about_window center];
			[about_window makeKeyAndOrderFront: nil];
			break;
		case 5: // DONATE
				#define DONATE_URL @"https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=malcom%2emac%40gmail%2ecom&item_name=WebSMSLib%20Mac&item_number=websmslib_mac&amount=7%2e50&no_shipping=0&return=http%3a%2f%2fwww%2emalcom%2dmac%2ecom%2fnemo%2fblog%2fbuy%2dnemo%2dlicense%2f&no_note=1&tax=0&currency_code=EUR&lc=IT&bn=PP%2dDonationsBF&charset=UTF%2d8"
				[[NSWorkspace sharedWorkspace] openURL: [NSURL URLWithString: DONATE_URL]];

			break;
		case 6: // CHECK UPDATES
			[_updateEngine checkForUpdates: nil];
			break;
			break;
		case 7: // QUIT
			[NSApp terminate: nil];
			break;
	}
}

#pragma mark SEND EVENTS

- (void) websms_startSendingProcess:(WebSMSEngine *) engine totalStages:(int) _stages {
	[self addToLogView: @"Starting send process (%d tasks to complete)...",_stages];
	
	[hud_fld_subStatusField setStringValue: [NSString stringWithFormat: 
											NSLocalizedStringFromTable(@"Sending_StartLoadingStages",@"Dialogs",@""),
											 _stages]];
	[hud_prog_statusIndicator setMaxValue: _stages];
	[self _resetUIToEnableSend: NO];
}

- (void) websms_sendingSucceded:(WebSMSEngine *) engine {
	[self addToLogView: @"Sending succeded..."];
	
	[self _showResultPanelAsError: NO 
						withTitle: [NSString stringWithFormat: 
										NSLocalizedStringFromTable(@"Sending_SendingOK",@"Dialogs",@""),
										[param_selectedDestination objectForKey: people_data_name]]
					   andMessage: [NSString stringWithFormat: 
										NSLocalizedStringFromTable(@"Sending_SendingOK_Desc",@"Dialogs",@""),
											[[engine getPlugin] name],
											[param_selectedDestination objectForKey: people_data_name],
											[param_selectedDestination objectForKey: people_data_phone]]];
}

- (void) websms_sendingFailed:(WebSMSEngine *) engine {
	[self addToLogView:@"Sending failed..."];
}

- (void) websms_redirectingToPage:(NSString *) _urlPage {
	[hud_fld_subStatusField setStringValue: [NSString stringWithFormat: 
												NSLocalizedStringFromTable(@"Sending_WaitingData",@"Dialogs",@""),_urlPage]];
}

- (void) websms_sendingErrorOccurred:(NSString *) error from:(WebSMSEngine *) engine {
	[self addToLogView: @"Error occurred: %@",error];

	[self _showResultPanelAsError: YES 
						withTitle:NSLocalizedStringFromTable(@"Sending_ConnectionError",@"Dialogs",@"") 
					   andMessage:error];
}

- (void) websms_availableMessages:(int) num_msg from:(WebSMSEngine *) engine {
	[self addToLogView: @"Available messages are %d",num_msg];
}

- (void) websms_connectionFailedToServer:(NSString *) _error stageToProcess:(int) _stage from:(WebSMSEngine *) engine {
	[self addToLogView: @"Connection failed %@",_error];

	[self _showResultPanelAsError: YES 
						withTitle:NSLocalizedStringFromTable(@"Sending_ConnectionFailed",@"Dialogs",@"") 
					   andMessage:NSLocalizedStringFromTable(@"Sending_ConnectionFailed_Desc",@"Dialogs",@"")];
}

- (void) _showResultPanelAsError:(BOOL) _err withTitle:(NSString *) _title andMessage:(NSString *) _msg {
	[self _resetUIToEnableSend: YES];
	
	if(_err) [hud_img_resultIcon setImage: [NSImage imageNamed: @"delete_item"]];
	else [hud_img_resultIcon setImage: [NSImage imageNamed: @"accept_item"]];
	
	[hud_fld_resultMessage setStringValue: _title];
	[hud_fld_resultDestination setStringValue: _msg];
	[_view_sendResult setNeedsDisplay: YES];
	
	[_view_centralMainView exchangeView: _view_sendingMessage withView: _view_sendResult];
}

- (void) websms_connectionEstablishedFrom:(WebSMSEngine *) engine currentStageIs:(int) _stage {
	[self addToLogView: @"-> Connection established for stage %d",_stage];
	
	[hud_fld_subStatusField setStringValue: NSLocalizedStringFromTable(@"Sending_ConnectionEstablished",@"Dialogs",@"")];
}

- (void) websms_performedStage:(int) _cStep of:(int) _totalStage from:(WebSMSEngine *) engine {
	[self addToLogView: @"Performing send at stage %d/%d",_cStep,_totalStage];
	
	[hud_fld_statusField setStringValue: [NSString stringWithFormat: 
											NSLocalizedStringFromTable(@"Sending_PerformingStageN",@"Dialogs",@""),
											 _cStep,_totalStage]];
	
	
	[hud_prog_statusIndicator incrementBy: 1.0];
	[hud_prog_statusIndicator setNeedsDisplay: YES];
}

- (void) websms_wrongResponseFromServerForURL:(NSString *) _url withMessage:(NSString *) _msg for:(WebSMSEngine *) engine {
	[self addToLogView: @"Bad response from server loading: %@: %@",_url,_msg];
	[self _showResultPanelAsError: YES 
						withTitle:NSLocalizedStringFromTable(@"Sending_SendingFailed",@"Dialogs",@"") 
					   andMessage:NSLocalizedStringFromTable(@"Sending_WrongResponseFromServer",@"Dialogs",@"")];
}

- (void) websms_sendAborted:(WebSMSEngine *) engine {
	[self addToLogView: @"Send was aborted by user"];

	[self _showResultPanelAsError: YES 
						withTitle:NSLocalizedStringFromTable(@"Sending_SendingAborted",@"Dialogs",@"") 
					   andMessage:NSLocalizedStringFromTable(@"Sending_SendingAborted_Desc",@"Dialogs",@"")];
}

- (void) websms_requestCaptchaCode:(NSString *) captcha_src from:(WebSMSEngine *) engine {
	[self addToLogView: @"Site request captcha code... Waiting for user interact"];
	[hud_img_captchaCode setImage: [[NSImage alloc] initWithContentsOfURL: [NSURL URLWithString: captcha_src]]];	
	[hud_fld_statusField setStringValue: NSLocalizedStringFromTable(@"Sending_WaitCaptcha",@"Dialogs",@"")];
	[hud_fld_subStatusField setStringValue: @""];
	[hud_prog_statusIndicator setIndeterminate: YES];
	[hud_prog_statusIndicator startAnimation: nil];

	[hud_img_captchaCode setHidden: NO withFade: YES];
	[hud_btn_arrow setHidden: NO withFade:YES];
	[hud_fld_captchaUser setHidden: NO];
	[[hud_fld_captchaUser enclosingScrollView] setHidden: NO];
	[hud_fld_captchaUser setNeedsDisplay: YES];
	[attachedWindow viewsNeedDisplay];
	
	[hud_fld_captchaUser setString: NSLocalizedStringFromTable(@"UI_InsertCaptcha",@"Dialogs",@"")];
	
	[hud_btn_abort setTitle: NSLocalizedStringFromTable(@"UI_ContinueCaptcha",@"Dialogs",@"")];
}

- (void) websms_missingVariable:(NSString *) _varName forStage:(int) _cStage pageContent:(NSString *) _data for:(WebSMSEngine *) engine {
	[self addToLogView: @"Cannot found variable in page at stage %d (%@ - %d length). An unhandled exception (not the expected page but another, with an error? bad number format?) could also be raised",_cStage,_varName,[_data length]];
}

@end
