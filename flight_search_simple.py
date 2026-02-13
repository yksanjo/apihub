#!/usr/bin/env python3
"""
Flight Search Script for NYC to Japan in February
"""

import datetime

def get_february_dates(year=2025):
    """Get February dates for the given year"""
    feb_dates = []
    for day in range(1, 29):
        try:
            date = datetime.date(year, 2, day)
            feb_dates.append(date.strftime("%Y-%m-%d"))
        except ValueError:
            break
    return feb_dates

def print_search_strategies():
    """Print strategies for finding cheap flights"""
    
    strategies = [
        "1. **Be Flexible with Dates**: February is a good month for Japan travel (after New Year, before cherry blossom season).",
        "2. **Check Multiple Airports**: NYC has JFK, LGA, and EWR. Japan has NRT (Tokyo Narita), HND (Tokyo Haneda), KIX (Osaka), FUK (Fukuoka), CTS (Sapporo).",
        "3. **Use Incognito Mode**: Flight prices can increase based on search history.",
        "4. **Set Price Alerts**: Use Google Flights, Kayak, or Skyscanner price alerts.",
        "5. **Consider Nearby Airports**: Sometimes flying to nearby cities can be cheaper.",
        "6. **Check Different Airlines**:",
        "   - Direct flights: ANA, JAL, United, Delta",
        "   - Connecting flights: Korean Air, Asiana, Cathay Pacific, China Airlines",
        "   - Budget options: Zipair (JAL's low-cost), Air Premia",
        "7. **Best Booking Time**: Typically 1-3 months in advance for international flights.",
        "8. **Travel Days**: Tuesday, Wednesday, and Saturday are often cheapest.",
        "9. **Use VPN**: Sometimes changing your location can show different prices.",
        "10. **Check Student/Young Traveler Discounts**: If applicable.",
    ]
    
    print("\n" + "="*80)
    print("STRATEGIES FOR FINDING CHEAP FLIGHTS FROM NYC TO JAPAN IN FEBRUARY")
    print("="*80)
    for strategy in strategies:
        print(strategy)
    
    print("\n" + "="*80)
    print("EXPECTED PRICE RANGES (Round Trip):")
    print("="*80)
    print("• Budget/Connecting: $600 - $900")
    print("• Standard Direct: $900 - $1,400")
    print("• Premium/Last Minute: $1,400+")
    print("\nNote: Prices vary based on exact dates, booking time, and airline.")

def generate_search_urls():
    """Generate search URLs for popular flight search engines"""
    
    # Sample URLs
    sample_urls = [
        ("Google Flights (JFK to NRT, Feb 10-24)", 
         "https://www.google.com/travel/flights?q=Flights%20from%20JFK%20to%20NRT%20on%202025-02-10%20returning%202025-02-24"),
        
        ("Kayak (JFK to HND, Feb 17-Mar 3)", 
         "https://www.kayak.com/flights/JFK-HND/2025-02-17/2025-03-03"),
        
        ("Skyscanner (EWR to KIX, Feb 3-17)", 
         "https://www.skyscanner.com/transport/flights/ewr/kix/250203/250217/"),
        
        ("Google Flights (LGA to FUK, Feb 24-Mar 10)", 
         "https://www.google.com/travel/flights?q=Flights%20from%20LGA%20to%20FUK%20on%202025-02-24%20returning%202025-03-10"),
    ]
    
    return sample_urls

def main():
    """Main function"""
    
    print("="*80)
    print("FLIGHT SEARCH: NYC TO JAPAN IN FEBRUARY")
    print("="*80)
    
    print_search_strategies()
    
    urls = generate_search_urls()
    
    print("\n" + "="*80)
    print("QUICK SEARCH LINKS (Sample Dates):")
    print("="*80)
    
    for site, url in urls:
        print(f"\n{site}:")
        print(f"  {url}")
    
    print("\n" + "="*80)
    print("RECOMMENDED ACTIONS:")
    print("="*80)
    print("1. Visit Google Flights and use their date grid to find cheapest days")
    print("2. Set up price alerts on multiple sites")
    print("3. Check airlines directly (sometimes they have sales not on aggregators)")
    print("4. Consider flying mid-week for better prices")
    print("5. Look for error fares or flash sales (follow @SecretFlying, @TheFlightDeal)")
    
    print("\n" + "="*80)
    print("ADDITIONAL TIPS:")
    print("="*80)
    print("• February 2025 specific: Check for Lunar New Year sales (Feb 10, 2025)")
    print("• Consider one-way tickets on different airlines")
    print("• Check credit card travel portals if you have travel rewards")
    print("• Look for 'hidden city' ticketing (but be aware of risks)")
    
    print("\nGood luck with your flight search!")

if __name__ == "__main__":
    main()