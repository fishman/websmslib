#ifdef TARGET_OS_MAC
	#import <Cocoa/Cocoa.h>
#endif
#ifdef IPHONE
	#import <Foundation/Foundation.h>
#endif

@protocol MCDebug_DelegateProtocol
	- (void) debug_dataReceived:(NSString *) _data;
@end

@interface MCDebug : NSObject {
	BOOL	ass_debugOn;
	NSObject <MCDebug_DelegateProtocol> *_delegateView;
}

+ (MCDebug *) sharedDebug;
- (void) printDebug:(id) _class message:(NSString *) aFormat, ...;
- (void) setDebugON:(BOOL) _de;
- (void) setDelegate:(NSObject <MCDebug_DelegateProtocol> *) _del; 

@end
