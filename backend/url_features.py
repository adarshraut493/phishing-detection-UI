import re
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup

def extract_url_features(url):

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""

    def count_digits(s): return sum(c.isdigit() for c in s)
    def count_char(s, ch): return s.count(ch)

    # URL-only features
    NumDots = count_char(url, ".")
    SubdomainLevel = hostname.count(".")
    PathLevel = path.count("/")
    UrlLength = len(url)
    NumDash = count_char(url, "-")
    NumDashInHostname = hostname.count("-")
    AtSymbol = count_char(url, "@")
    TildeSymbol = count_char(url, "~")
    NumUnderscore = count_char(url, "_")
    NumPercent = count_char(url, "%")
    NumQueryComponents = query.count("=")
    NumAmpersand = count_char(url, "&")
    NumHash = count_char(url, "#")
    NumNumericChars = count_digits(url)
    NoHttps = 1 if not url.startswith("https") else 0
    RandomString = 1 if re.search(r"[A-Za-z0-9]{10,}", url) else 0
    IpAddress = 1 if re.match(r"^\d+\.\d+\.\d+\.\d+$", hostname) else 0
    DomainInSubdomains = 1 if hostname in path else 0
    DomainInPaths = 1 if hostname in path else 0
    HttpsInHostname = 1 if "https" in hostname else 0
    HostnameLength = len(hostname)
    PathLength = len(path)
    QueryLength = len(query)
    DoubleSlashInPath = 1 if "//" in path else 0

    # Download HTML for HTML-based features
    try:
        response = requests.get(url, timeout=5)
        html = response.text
        soup = BeautifulSoup(html, "html.parser")
    except:
        soup = None
        html = ""

    # Sensitive words
    NumSensitiveWords = len(re.findall(r"(secure|account|login|verify|bank|update)", url.lower()))

    # Embedded brand
    EmbeddedBrandName = 1 if re.search(r"(paypal|google|amazon|facebook)", url.lower()) else 0

    # External hyperlinks %
    try:
        all_links = soup.find_all("a")
        ext_links = [a for a in all_links if a.get("href") and hostname not in a.get("href", "")]
        PctExtHyperlinks = len(ext_links) / (len(all_links) + 1)
    except:
        PctExtHyperlinks = 0.0

    # External resource URLs %
    try:
        resources = soup.find_all(["img", "script", "link"])
        ext_res = [r for r in resources if hostname not in (r.get("src") or "") + (r.get("href") or "")]
        PctExtResourceUrls = len(ext_res) / (len(resources) + 1)
    except:
        PctExtResourceUrls = 0.0

    # Favicon external?
    try:
        favicon = soup.find("link", rel=lambda x: x and "icon" in x.lower())
        ExtFavicon = 1 if favicon and hostname not in (favicon.get("href") or "") else 0
    except:
        ExtFavicon = 0

    # Form actions
    InsecureForms = RelativeFormAction = ExtFormAction = AbnormalFormAction = 0
    if soup:
        for form in soup.find_all("form"):
            action = form.get("action") or ""
            if action.startswith("http://"):
                InsecureForms = 1
            if action.startswith("/"):
                RelativeFormAction = 1
            if hostname not in action:
                ExtFormAction = 1
            if action == "":
                AbnormalFormAction = 1

    # Null redirect %
    PctNullSelfRedirectHyperlinks = 0.0

    FrequentDomainNameMismatch = 0

    FakeLinkInStatusBar = 1 if "onmouseover" in html.lower() else 0
    RightClickDisabled = 1 if "event.button==2" in html else 0
    PopUpWindow = 1 if "window.open" in html else 0
    SubmitInfoToEmail = 1 if "mailto" in html else 0
    IframeOrFrame = 1 if "<iframe" in html.lower() else 0

    MissingTitle = 1
    if soup and soup.title and soup.title.string:
        MissingTitle = 0

    ImagesOnlyInForm = 1 if soup and any(f.find("img") for f in soup.find_all("form")) else 0

    # RT versions (copied directly)
    SubdomainLevelRT = SubdomainLevel
    UrlLengthRT = UrlLength
    PctExtResourceUrlsRT = PctExtResourceUrls
    AbnormalExtFormActionR = AbnormalFormAction
    ExtMetaScriptLinkRT = 0
    PctExtNullSelfRedirectHyperlinksRT = 0.0

    # FINAL 48-FEATURE VECTOR
    return [
        NumDots, SubdomainLevel, PathLevel, UrlLength, NumDash,
        NumDashInHostname, AtSymbol, TildeSymbol, NumUnderscore,
        NumPercent, NumQueryComponents, NumAmpersand, NumHash,
        NumNumericChars, NoHttps, RandomString, IpAddress,
        DomainInSubdomains, DomainInPaths, HttpsInHostname,
        HostnameLength, PathLength, QueryLength, DoubleSlashInPath,
        NumSensitiveWords, EmbeddedBrandName, PctExtHyperlinks,
        PctExtResourceUrls, ExtFavicon, InsecureForms,
        RelativeFormAction, ExtFormAction, AbnormalFormAction,
        PctNullSelfRedirectHyperlinks, FrequentDomainNameMismatch,
        FakeLinkInStatusBar, RightClickDisabled, PopUpWindow,
        SubmitInfoToEmail, IframeOrFrame, MissingTitle,
        ImagesOnlyInForm, SubdomainLevelRT, UrlLengthRT,
        PctExtResourceUrlsRT, AbnormalExtFormActionR,
        ExtMetaScriptLinkRT, PctExtNullSelfRedirectHyperlinksRT
    ]
