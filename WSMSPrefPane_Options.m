//
//  WSMSPrefPane_Options.m
//  websmslib
//
//  Created by malcom on 9/6/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WSMSPrefPane_Options.h"
#import "NSView+Fade.h"
#import "TestClass.h"

@implementation WSMSPrefPane_Options

- (void) awakeFromNib {
	[fld_customSignature setDelegate: self];
	[self reloadSettings];
}

- (id) init
{
	self = [super init];
	if (self != nil) {
	}
	return self;
}


- (void) reloadSettings {
	// COUNTRIES
	[pop_countries removeAllItems];
	NSDictionary *dic = [[NSDictionary alloc] initWithContentsOfFile: 
						 [NSString stringWithFormat: @"%@/%@",[[NSBundle mainBundle] resourcePath], @"ccountries.plist"]];
	
	NSArray *l = [[dic allKeys] sortedArrayUsingSelector:@selector(compare:)];
	int k;
	NSMenu *listMenu = [[[NSMenu alloc] init] autorelease];
	for (k=0; k < [l count]; k++) {
		NSMenuItem *cItem = [[[NSMenuItem alloc] initWithTitle: [NSString stringWithFormat: @"%@ (+%@)",[l objectAtIndex: k],[dic objectForKey: [l objectAtIndex:k]]]
														action: NULL// @selector(btn_changePreference:) 
												 keyEquivalent: @""] autorelease];
		[cItem setTarget: self];
		[cItem setRepresentedObject: [l objectAtIndex: k]];
		[listMenu addItem: cItem];
	}
	[pop_countries setMenu: listMenu];
	
	NSString *sel = [[NSUserDefaults standardUserDefaults] objectForKey: @"country"];
	if (sel != nil)
		[pop_countries selectItemWithTitle: [NSString stringWithFormat: @"%@ (+%@)",sel,[dic objectForKey: sel]]];
	else [pop_countries selectItemAtIndex: 0];
	
	// REMEMBER
	[btn_rememberAccounts setState: ( [[[NSUserDefaults standardUserDefaults] objectForKey:@"remember_accounts"] boolValue] 
									 ? NSOnState : NSOffState)];
		
	// SIGNATURE
	[pop_signature selectItemAtIndex: [[[NSUserDefaults standardUserDefaults] objectForKey:@"signature_option"] intValue]];
	[fld_customSignature setHidden: [pop_signature indexOfSelectedItem] == 0];
	if ([[NSUserDefaults standardUserDefaults] objectForKey:@"signature_text"])
		[fld_customSignature setStringValue: [[NSUserDefaults standardUserDefaults] objectForKey:@"signature_text"]];
	else
		[fld_customSignature setStringValue:@""];
	[self btn_changePreference:fld_customSignature];
	
	[btn_enableSpellCheck setState: ( [[[NSUserDefaults standardUserDefaults] objectForKey:@"spell_check"] boolValue] 
									 ? NSOnState : NSOffState)];
	
	[btn_enableDeepDebug setState: ( [[[NSUserDefaults standardUserDefaults] objectForKey:@"deep_debug"] boolValue] 
									 ? NSOnState : NSOffState)];
}

- (IBAction) btn_changePreference:(id) sender {
	if (sender == btn_enableDeepDebug) {
		[[NSUserDefaults standardUserDefaults] setObject: [NSNumber numberWithBool: ([btn_enableDeepDebug state] == NSOnState ? YES:NO)]
												forKey:@"deep_debug"];
	}
	
	if (sender == btn_enableSpellCheck) {
		NSNumber * en = [NSNumber numberWithBool: ([btn_enableSpellCheck state] == NSOnState ? YES:NO)];
		[[TestClass sharedMainClass] _enableCheckSpelling: [en boolValue]];
		[[NSUserDefaults standardUserDefaults] setObject: en forKey:@"spell_check"];
	}
	
	if (sender == btn_rememberAccounts) {
		[[NSUserDefaults standardUserDefaults] setObject: [NSNumber numberWithBool: ([btn_rememberAccounts state] == NSOnState ? YES:NO)]
												  forKey:@"remember_accounts"];
	}
	
	if (sender == pop_countries) {
		[[NSUserDefaults standardUserDefaults] setObject: [[sender selectedItem] representedObject] 
												  forKey: @"country"];
	}
	
	if (sender == pop_signature) {
		[[NSUserDefaults standardUserDefaults] setObject: [NSNumber numberWithInt: [pop_signature indexOfSelectedItem]]
												  forKey: @"signature_option"];
		
		[fld_customSignature setHidden: ([pop_signature indexOfSelectedItem] != 4)];
	}
	
	[[NSUserDefaults standardUserDefaults] synchronize];
}
		
- (void)controlTextDidEndEditing:(NSNotification *)aNotification{
	if ([aNotification object] == fld_customSignature) {
		[self btn_changePreference: pop_signature];
		[[NSUserDefaults standardUserDefaults] setObject: [fld_customSignature stringValue] forKey: @"signature_text"];
	}
}

@end
