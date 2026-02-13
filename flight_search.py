#!/usr/bin/env python3
"""
Flight Search Script for NYC to Japan in February

This script provides guidance on how to find cheap flights from NYC to Japan.
Since we don't have direct API access, we'll outline the best approaches.
"""

import datetime
import webbrowser
import sys

def get_february_dates(year=2025):
    """Get February dates for the given year"""
    feb_dates = []
    for day in range(1, 29):  # February has 28 days (29 in leap years)
        try:
            date = datetime.date(year, 2, day)
            feb_dates.append(date.strftime("%Y-%m-%d"))
        except ValueError:
            break
    return feb_dates

def generate_search_urls():
    """Generate search URLs for popular flight search engines"""
    
    # Major airports in NYC
    nyc_airports = ["JFK", "LGA", "EWR"]
    
    # Major airports in Japan
    japan_airports = ["NRT", "HND", "KIX", "FUK", "CTS"]
    
    # Sample dates in February 2025
    sample_dates = [
        ("2025-02-10", "2025-02-24"),  # 2 weeks
        ("2025-02-17", "2025-03-03"),  # 2 weeks
        ("2025-02-03", "2025-02-17"),  # 2 weeks
        ("2025-02-24", "2025-03-10"),  # 2 weeks
    ]
    
    urls = []
    
    # Google Flights URLs
    for dep_airport in nyc_airports:
        for arr_airport in japan_airports:
            for dep_date, ret_date in sample_dates:
                url = f"https://www.google.com/travel/flights?q=Flights%20from%20{dep_airport}%20to%20{arr_airport}%20on%20{dep_date}%20returning%20{ret_date}"
                urls.append(("Google Flights", url))
    
    # Kayak URLs
    for dep_airport in nyc_airports:
        for arr_airport in japan_airports:
            for dep_date, ret_date in sample_dates:
                url = f"https://www.kayak.com/flights/{dep_airport}-{arr_airport}/{dep_date}/{ret_date}"
                urls.append(("Kayak", url))
    
    # Skyscanner URLs
    for dep_airport in nyc_airports:
        for arr_airport in japan_airports:
            for dep_date, ret_date in sample_dates:
                url = f"https://www.skyscanner.com/transport/flights/{dep_airport}/{arr_airport}/{dep_date}/{ret_date}/"
                urls.append(("Skyscanner", url))
    
    return urls

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
    
    # Show a few sample URLs
    for i, (site, url) in enumerate(urls[:10], 1):
        print(f"{i}. {site}: {url}")
    
    print(f"\n... and {len(urls) - 10} more search combinations")
    
    print("\n" + "="*80)
    print("RECOMMENDED ACTIONS:")
    print("="*80)
    print("1. Visit Google Flights and use their date grid to find cheapest days")
    print("2. Set up price alerts on multiple sites")
    print("3. Check airlines directly (sometimes they have sales not on aggregators)")
    print("4. Consider flying mid-week for better prices")
    print("5. Look for error fares or flash sales (follow @SecretFlying, @TheFlightDeal)")
    
    # Ask if user wants to open browser
    print("\n" + "="*80)
    response = input("Would you like to open sample search links in browser? (y/n): ")
    
    if response.lower() == 'y':
        print("Opening sample searches...")
        # Open a few sample URLs
        sample_urls = [
            "https://www.google.com/travel/flights?q=Flights%20from%20JFK%20to%20NRT%20on%202025-02-10%20returning%202025-02-24",
            "https://www.kayak.com/flights/JFK-NRT/2025-02-10/2025-02-24",
            "https://www.skyscanner.com/transport/flights/jfk/nrt/250210/250224/"
        ]
        
        for url in sample_urls:
            webbrowser.open(url)
            print(f"Opened: {url}")
    
    print("\nGood luck with your flight search!")

if __name__ == "__main__":
    main()