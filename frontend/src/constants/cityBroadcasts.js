/**
 * VayuGrid City-Matched Vernacular Broadcast Registry
 * Delivers localized public health advisories where landmarks and primary languages
 * correspond directly with the monitored Indian city archetype.
 */

export const CITY_BROADCAST_CONFIG = {
  bengaluru: {
    primaryLanguage: 'kn',
    supportedLanguages: ['kn', 'en', 'hi', 'ta', 'te'],
    hotspots: ['Bellandur Wetland Buffer', 'Peenya Industrial Estate', 'Whitefield ITPL Corridor', 'Varthur Govt School'],
    scenarios: [
      {
        id: 'ambient',
        title: 'Citywide Air Quality & Vehicular Stagnation Directive',
        severity: 'MODERATE',
        texts: {
          kn: 'ಬೆಂಗಳೂರು ಬಿಬಿಎಂಪಿ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ವಾಯು ಗುಣಮಟ್ಟ ಮಧ್ಯಮ ಮಟ್ಟದಲ್ಲಿದೆ (AQI 118). ಹೊರ ವರ್ತುಲ ರಸ್ತೆ ಮತ್ತು ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ವಾಹನಗಳ ದಟ್ಟಣೆಯಿಂದಾಗಿ NO2 ಮತ್ತು PM10 ಮಟ್ಟ ಹೆಚ್ಚಾಗಿದೆ. ಅಸ್ತಮಾ ಇರುವವರು ಹೊರಾಂಗಣ ವ್ಯಾಯಾಮವನ್ನು ಮಿತಿಗೊಳಿಸಿ.',
          en: 'Bengaluru Urban Alert: CAAQMS telemetry indicates Moderate air quality (AQI 118). Elevated vehicular NO2 and PM10 along Outer Ring Road, Silk Board, and Whitefield corridors. Asthmatic individuals are advised to limit strenuous morning outdoor workouts.',
          hi: 'बेंगलुरु नगर निगम बुलेटिन: वायु गुणवत्ता वर्तमान में मध्यम स्तर (AQI 118) पर है। आउटर रिंग रोड व व्हाइटफील्ड में वाहनों के धुएं से NO2 स्तर बढ़ा हुआ है। सांस के मरीज सुबह के समय भारी व्यायाम से बचें।',
          ta: 'பெங்களூரு மாநகராட்சி அறிவிப்பு: காற்று தரம் மிதமான அளவில் உள்ளது (AQI 118). வெளிவட்ட சாலையில் வாகனப் புகையால் NO2 அதிகரித்துள்ளது. மூச்சுத்திணறல் உள்ளவர்கள் காலை உடற்பயிற்சியை தவிர்க்கவும்.',
          te: 'బెంగళూరు పౌర హెచ్చరిక: గాలి నాణ్యత ప్రస్తుతం మధ్యస్థంగా ఉంది (AQI 118). ఔటర్ రింగ్ రోడ్ మరియు వైట్‌ఫీల్డ్ వద్ద వాహన కాలుష్యం అధికంగా ఉంది. ఆస్తమా ఉన్నవారు బహిరంగ వ్యాయామాలను పరిమితం చేయండి.',
        },
      },
      {
        id: 'incident',
        title: 'Bellandur Wetland Biomass Pyrolysis Plume Alert',
        severity: 'CRITICAL',
        texts: {
          kn: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಬೆಳ್ಳಂದೂರು ಕೆರೆ ಬಫರ್ ವಲಯದಲ್ಲಿ ಅಕ್ರಮ ಘನತ್ಯಾಜ್ಯ ದಹನ ಪತ್ತೆಯಾಗಿದೆ. ದಟ್ಟವಾದ ವಿಷಕಾರಿ ಹೊಗೆಯು ವರ್ತೂರು ಮತ್ತು ಯಮಲೂರು ಕಡೆಗೆ ಬೀಸುತ್ತಿದೆ. ಸ್ಥಳೀಯ ಶಾಲೆಗಳು ಮತ್ತು ನಿವಾಸಿಗಳು ತಕ್ಷಣ ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿರಿ.',
          en: 'CRITICAL PLUME WARNING: Illegal open waste burning detected along Bellandur lake perimeter. Dense toxic particulate plume drifting East-Northeast towards Varthur Ward. All schools and residents within 2 km must seal windows and avoid outdoor exposure.',
          hi: 'अति आवश्यक चेतावनी: बेलंदूर झील के निकट खुले कचरे में आग लगने की घटना दर्ज की गई है। जहरीला धुआं वरथूर की ओर फैल रहा है। 2 किमी के दायरे में सभी खिड़कियां बंद रखें।',
          ta: 'அவசர எச்சரிக்கை: பெல்லந்தூர் ஏரி பகுதியில் நச்சுப் புகை வெளியேறுகிறது. வர்தூர் பகுதி மக்கள் மற்றும் பள்ளிகள் உடனடியாக ஜன்னல்களை மூடி வீட்டிற்குள் இருக்கவும்.',
          te: 'ముఖ్య హెచ్చరిక: బెల్లందూరు చెరువు సమీపంలో వ్యర్థాల దహనం గుర్తించబడింది. విషపూరిత పొగ వర్తూరు వైపు వ్యాపిస్తోంది. స్థానిక పాఠశాలలు తక్షణమే కిటికీలు మూసివేయాలి.',
        },
      },
      {
        id: 'receptors',
        title: 'Peenya Industrial Zone Sensitive Receptor Advisory',
        severity: 'HIGH',
        texts: {
          kn: 'ಪೀಣ್ಯ ಕೈಗಾರಿಕಾ ವಲಯ ಎಚ್ಚರಿಕೆ: ಕೈಗಾರಿಕಾ ಹೊರಸೂಸುವಿಕೆ ಮತ್ತು ಧೂಳಿನಿಂದಾಗಿ PM2.5 ಹೆಚ್ಚಾಗಿದೆ. ಪೀಣ್ಯ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಶಾಲಾ ಮೈದಾನಗಳಲ್ಲಿ ಹೊರಾಂಗಣ ಕ್ರೀಡೆಗಳನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.',
          en: 'Peenya Industrial Corridor Advisory: Uncontained fugitive stack emissions detected near Sector 3. Sensitive infrastructure warning active for Peenya Primary Health Center and local community schools. Outdoor sports suspended.',
          hi: 'पीण्या औद्योगिक क्षेत्र चेतावनी: सेक्टर 3 के पास भारी धूल व औद्योगिक उत्सर्जन दर्ज। पीण्या स्वास्थ्य केंद्र और स्थानीय स्कूलों में बाहरी खेल गतिविधियां स्थगित की जाती हैं।',
          ta: 'பீண்யா தொழிற்பேட்டை எச்சரிக்கை: தொழிற்சாலை புகையால் காற்று தரம் குறைந்துள்ளது. ஆரம்ப சுகாதார நிலையம் மற்றும் பள்ளிகளில் வெளிப்புற விளையாட்டுகள் ரத்து செய்யப்பட்டுள்ளன.',
          te: 'పీణ్యా పారిశ్రామిక సలహా: సెక్టార్ 3 వద్ద కాలుష్య కారకాలు పెరిగాయి. పీణ్యా ప్రాథమిక ఆరోగ్య కేంద్రం మరియు పాఠశాలల్లో బహిరంగ ఆటలు తాత్కాలికంగా నిలిపివేయబడ్డాయి.',
        },
      },
    ],
  },
  delhi: {
    primaryLanguage: 'hi',
    supportedLanguages: ['hi', 'en', 'pa', 'ur', 'kn'],
    hotspots: ['Bhalaswa Landfill Fringe', 'Anand Vihar ISBT', 'Ghazipur Perimeter', 'Sarvodaya Kanya Vidyalaya'],
    scenarios: [
      {
        id: 'ambient',
        title: 'दिल्ली-एनसीआर वायु गुणवत्ता आपातकालीन बुलेटिन',
        severity: 'VERY_POOR',
        texts: {
          hi: 'दिल्ली-एनसीआर वायु गुणवत्ता आपातकालीन बुलेटिन: वर्तमान वायु गुणवत्ता सूचकांक 342 (अत्यंत खराब) दर्ज किया गया है। सीएक्यूएम ग्रैप-4 के कड़े नियम लागू हैं। बच्चे, बुजुर्ग व दमा रोगी घर से बाहर न निकलें और N95 मास्क का अनिवार्य उपयोग करें।',
          en: 'Delhi-NCR Emergency Health Directive: Air Quality Index stands at 342 (Very Poor category) across MCD jurisdictions. CAQM GRAP Stage IV statutory mitigation active. Vulnerable populations must remain indoors with active air filtration.',
          pa: 'ਦਿੱਲੀ-ਐਨਸੀਆਰ ਸਿਹਤ ਚੇਤਾਵਨੀ: ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ 342 (ਬਹੁਤ ਖਰਾਬ) ਦਰਜ ਕੀਤੀ ਗਈ ਹੈ। ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਨੂੰ ਘਰਾਂ ਦੇ ਅੰਦਰ ਰਹਿਣ ਅਤੇ ਮਾਸਕ ਪਹਿਨਣ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।',
          kn: 'ದೆಹಲಿ-ಎನ್‌ಸಿಆರ್ ತುರ್ತು ಆರೋಗ್ಯ ಪ್ರಕಟಣೆ: ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ 342 (ತೀವ್ರ ಕಳಪೆ) ಆಗಿದೆ. ಗ್ರ್ಯಾಪ್-4 ನಿಯಮಗಳು ಜಾರಿಯಲ್ಲಿದ್ದು, ದುರ್ಬಲ ವ್ಯಕ್ತಿಗಳು ಮನೆಯೊಳಗೆ ಇರಲು ಸೂಚಿಸಲಾಗಿದೆ.',
          te: 'ఢిల్లీ-ఎన్‌సీఆర్ అత్యవసర హెచ్చరిక: గాలి నాణ్యత సూచీ 342 (చాలా పేలవమైనది) గా నమోదైంది. పౌరులు N95 మాస్కులు ధరించాలని మరియు బయటకు రావద్దని సూచించబడింది.',
        },
      },
      {
        id: 'incident',
        title: 'भलस्वा लैंडफिल परिधि टॉक्सिक वेस्ट पायरोलिसिस अलर्ट',
        severity: 'CRITICAL',
        texts: {
          hi: 'अति आवश्यक चेतावनी: भलस्वा लैंडफिल फ्रिंज पर बड़े पैमाने पर प्लास्टिक कचरे में आग दर्ज की गई है। अत्यधिक जहरीला क्लोरीनयुक्त धुआं रोहिणी व आउटर रिंग रोड की ओर फैल रहा है। 2.5 किमी क्षेत्र के निवासी तुरंत खिड़कियां बंद करें।',
          en: 'CRITICAL SMOKE PLUME WARNING: Massive uncontained plastic waste fire detected at Bhalaswa Landfill peripheral belt. Dense chlorinated pyrolysis plume downwind towards Sector 16 & Rohini corridor. Downwind schools must remain sealed.',
          pa: 'ਜ਼ਰੂਰੀ ਚੇਤਾਵਨੀ: ਭਲਸਵਾ ਲੈਂਡਫਿਲ ਨੇੜੇ ਪਲਾਸਟਿਕ ਦੇ ਕੂੜੇ ਨੂੰ ਅੱਗ ਲੱਗਣ ਕਾਰਨ ਜ਼ਹਿਰੀਲਾ ਧੂੰਆਂ ਫੈਲ ਰਿਹਾ ਹੈ। ਰੋਹਿਣੀ ਖੇਤਰ ਦੇ ਲੋਕ ਖਿੜਕੀਆਂ ਬੰਦ ਰੱਖਣ।',
          kn: 'ತೀವ್ರ ಎಚ್ಚರಿಕೆ: ಭಲಸ್ವಾ ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ ಪ್ರದೇಶದಲ್ಲಿ ಭಾರಿ ಪ್ಲಾಸ್ಟಿಕ್ ಬೆಂಕಿ ಕಾಣಿಸಿಕೊಂಡಿದೆ. ರೋಹಿಣಿ ಪ್ರದೇಶದ ಕಡೆಗೆ ವಿಷಕಾರಿ ಹೊಗೆ ಹರಡುತ್ತಿದ್ದು, ಸಾರ್ವಜನಿಕರು ಎಚ್ಚರದಿಂದಿರಿ.',
          te: 'అత్యవసర హెచ్చరిక: భలస్వా డంపింగ్ యార్డ్ వద్ద ప్లాస్టిక్ వ్యర్థాలు తగలబడుతున్నాయి. రోహిణి వైపు నల్లటి పొగ వ్యాపిస్తోంది. ప్రజలు అప్రమత్తంగా ఉండాలి.',
        },
      },
      {
        id: 'receptors',
        title: 'आनंद विहार व गाजीपुर संवेदनशील कॉरिडोर निर्देश',
        severity: 'HIGH',
        texts: {
          hi: 'संवेदनशील क्षेत्र चेतावनी: आनंद विहार बस टर्मिनल और गाजीपुर बॉर्डर पर भारी धूल व औद्योगिक धुएं का जमाव। सर्वोदय कन्या विद्यालय व पास के अस्पतालों में प्यूरिफायर चालू रखें। बाहरी सभाएं प्रतिबंधित।',
          en: 'Sensitive Infrastructure Directive: Severe PM10 and particulate stagnation around Anand Vihar ISBT and Ghazipur perimeter. Sarvodaya Kanya Vidyalaya and local clinics must enforce indoor sheltering protocols.',
          pa: 'ਸੰਵੇਦਨਸ਼ੀਲ ਖੇਤਰ ਨਿਰਦੇਸ਼: ਆਨੰਦ ਵਿਹਾਰ ਅਤੇ ਗਾਜ਼ੀਪੁਰ ਖੇਤਰ ਵਿੱਚ ਧੂੜ ਅਤੇ ਪ੍ਰਦੂਸ਼ਣ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ। ਸਕੂਲਾਂ ਅਤੇ ਹਸਪਤਾਲਾਂ ਵਿੱਚ ਸੁਰੱਖਿਆ ਨਿਯਮ ਲਾਗੂ ਕੀਤੇ ਗਏ ਹਨ।',
          kn: 'ಸೂಕ್ಷ್ಮ ವಲಯ ನಿರ್ದೇಶನ: ಆನಂದ್ ವಿಹಾರ್ ಮತ್ತು ಗಾಜಿಪುರ ಬಳಿ ತೀವ್ರ ಕಣ ಮಾಲಿನ್ಯ ದಾಖಲಾಗಿದೆ. ಶಾಲಾ ಕಾಲೇಜುಗಳು ಹೊರಗಿನ ಚಟುವಟಿಕೆಗಳನ್ನು ರದ್ದುಗೊಳಿಸಬೇಕು.',
          te: 'సున్నిత ప్రాంత ఆదేశాలు: ఆనంద్ విహార్ మరియు ఘాజీపూర్ ప్రాంతాల్లో ధూళి తీవ్రంగా ఉంది. పాఠశాలలు మరియు ఆసుపత్రులు జాగ్రత్తలు పాటించాలి.',
        },
      },
    ],
  },
  kanpur: {
    primaryLanguage: 'hi',
    supportedLanguages: ['hi', 'en', 'ur'],
    hotspots: ['Jajmau Leather Cluster', 'Panki Thermal Power Fringe', 'Gangetic Inversion Basin', 'KMC Ward 18'],
    scenarios: [
      {
        id: 'ambient',
        title: 'कानपुर नगर निगम वायु गुणवत्ता एवं तापीय विलोमन बुलेटिन',
        severity: 'VERY_POOR',
        texts: {
          hi: 'कानपुर जनस्वास्थ्य बुलेटिन: वायु गुणवत्ता सूचकांक 389 (गंभीर स्तर) दर्ज किया गया है। गंगा घाटी में वायुमंडलीय विलोमन के कारण चमड़ा उद्योग व वाहनों का धुआं निचली सतह पर फंसा हुआ है। नागरिक प्रातःकालीन सैर से बचें।',
          en: 'Kanpur Municipal Health Bulletin: CAAQMS telemetry indicates Very Poor air quality (AQI 389). Strong Gangetic basin thermal inversion trapping heavy industrial and particulate emissions. Avoid all early morning walks and outdoor exposure.',
          kn: 'ಕಾನ್ಪುರ ಆರೋಗ್ಯ ಪ್ರಕಟಣೆ: ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ 389 (ತೀವ್ರ ಕಳಪೆ). ಗಂಗಾ ನದಿ ತೀರದ ಉಷ್ಣತೆಯ ವಿಲೋಮದಿಂದಾಗಿ ಕೈಗಾರಿಕಾ ಹೊಗೆ ಕೆಳಮಟ್ಟದಲ್ಲಿ ಸಿಲುಕಿದೆ. ಸಾರ್ವಜನಿಕರು ಹೊರಗೆ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿ.',
          te: 'కాన్పూర్ నగర హెచ్చరిక: గాలి నాణ్యత సూచీ 389 గా ఉంది. గంగా పరీవాహక ప్రాంతంలో థర్మల్ ఇన్వర్షన్ వల్ల కాలుష్యం పేరుకుపోయింది. మార్నింగ్ వాక్స్ మానుకోండి.',
        },
      },
      {
        id: 'incident',
        title: 'जाजमऊ औद्योगिक बेल्ट सल्फर एवं पार्टिकुलेट फ्लैश अलर्ट',
        severity: 'CRITICAL',
        texts: {
          hi: 'औद्योगिक आपातकालीन चेतावनी: जाजमऊ टैनरी क्षेत्र में बिना शोधन के उत्सर्जन व बॉयलर धुएं का अत्यधिक स्तर दर्ज। नगर निगम ने एंटी-स्मॉग गन तैनात की हैं। वार्ड 18 व 22 के निवासी घरों में रहें।',
          en: 'INDUSTRIAL FLUSH WARNING: High-density particulate and sulfur emissions detected from unscrubbed boiler exhausts in Jajmau Leather Cluster. Anti-smog water cannons deployed by KMC. Residents of Ward 18 & 22 must remain indoors.',
          kn: 'ಕೈಗಾರಿಕಾ ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಜಾಜಮೌ ಚರ್ಮೋದ್ಯಮ ವಲಯದಲ್ಲಿ ಭಾರಿ ಹೊಗೆ ಪತ್ತೆಯಾಗಿದೆ. ಆಂಟಿ-ಸ್ಮಾಗ್ ಗನ್ ನಿಯೋಜಿಸಲಾಗಿದ್ದು, ನಿವಾಸಿಗಳು ಮನೆಯಲ್ಲೇ ಇರಲು ಕೋರಲಾಗಿದೆ.',
          te: 'పారిశ్రామిక అత్యవసర హెచ్చరిక: జాజ్మౌ లెదర్ క్లస్టర్‌లో అధిక పొగ వెలువడుతోంది. కెఎమ్‌సి యాంటీ-స్మాగ్ గన్స్ మోహరించింది. ప్రజలు ఇళ్లలోనే ఉండాలి.',
        },
      },
      {
        id: 'receptors',
        title: 'पनकी थर्मल व कल्यानपुर संवेदनशील वार्ड सुरक्षा निर्देश',
        severity: 'HIGH',
        texts: {
          hi: 'पनकी व कल्यानपुर कॉरिडोर चेतावनी: पनकी थर्मल पेरिफेरी में फ्लाय-ऐश व धूल का स्तर अत्यधिक। पास के प्राथमिक स्वास्थ्य केंद्रों और शैक्षणिक संस्थानों में खिड़कियां बंद रखी जाएं।',
          en: 'Panki Thermal & Kalyanpur Health Advisory: Elevated fly-ash particulate resuspension along the railway siding corridor. Sensitive infrastructure alert for Kalyanpur community schools and health centers.',
          kn: 'ಪಂಕಿ ಮತ್ತು ಕಲ್ಯಾಣಪುರ ಎಚ್ಚರಿಕೆ: ಪಂಕಿ ಥರ್ಮಲ್ ಸುತ್ತಮುತ್ತ ಧೂಳು ಹೆಚ್ಚಾಗಿದೆ. ಶಾಲೆಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳು ಮುನ್ನೆಚ್ಚರಿಕೆ ವಹಿಸಬೇಕು.',
          te: 'పంకి థర్మల్ ప్రాంత హెచ్చరిక: కళ్యాణ్‌పూర్ పరిసరాల్లో బూడిద మరియు ధూళి తీవ్రంగా ఉంది. పాఠశాలలు కిటికీలు మూసి ఉంచాలి.',
        },
      },
    ],
  },
  mumbai: {
    primaryLanguage: 'mr',
    supportedLanguages: ['mr', 'hi', 'en', 'gu'],
    hotspots: ['Bandra-Kurla Complex (BKC)', 'Chembur Refining Corridor', 'Deonar Dumping Ground', 'Eastern Express Highway'],
    scenarios: [
      {
        id: 'ambient',
        title: 'मुंबई महानगरपालिका हवेची गुणवत्ता आणि सागरी वारे बुलेटिन',
        severity: 'MODERATE',
        texts: {
          mr: 'बृहन्मुंबई महानगरपालिका सार्वजनिक सूचना: मुंबईतील हवेचा दर्जा मध्यम श्रेणीत (AQI 165) नोंदवला गेला आहे. सागरी आणि जमिनीवरील वाऱ्यांच्या बदलामुळे चेंबूर आणि वांद्रे-कुर्ला संकुलात धूळ साचली आहे. मास्कचा वापर करा.',
          hi: 'बीएमसी जनस्वास्थ्य बुलेटिन: मुंबई में वायु गुणवत्ता मध्यम श्रेणी (AQI 165) में दर्ज की गई है। तटीय नमी और निर्माण कार्यों के कारण बीकेसी व चेंबूर में धूल कण अधिक हैं। नागरिक मास्क का उपयोग करें।',
          en: 'Mumbai Metropolitan Air Advisory: CAAQMS index at 165 (Moderate category). Coastal land-sea breeze transition causing particulate stagnation along BKC, Chembur, and Eastern Express Highway construction zones.',
          gu: 'મુંબઈ મહાનગરપાલિકા ચેતવણી: મુંબઈમાં હવાની ગુણવત્તા મધ્યમ (AQI 165) છે. બીકેસી અને ચેમ્બુર વિસ્તારમાં બાંધકામની ધૂળ વધારે છે. નાગરિકો માસ્ક પહેરે.',
        },
      },
      {
        id: 'incident',
        title: 'चेंबूर आणि देवनार रिफायनरी पट्टा धूर चेतावणी',
        severity: 'CRITICAL',
        texts: {
          mr: 'तातडीची चेतावणी: देवनार आणि चेंबूर औद्योगिक पट्ट्यात दाट धूर पसरला आहे. पूर्वेकडील उपनगरांमध्ये दृश्यमानता कमी झाली आहे. लहान मुले आणि ज्येष्ठांनी घराबाहेर पडणे टाळावे.',
          en: 'CRITICAL FUGITIVE PLUME ALERT: Heavy low-elevation emissions detected near Deonar perimeter and Chembur refinery corridor. East-drifting particulate plume affecting Govandi residential blocks. Indoor sheltering advised.',
          hi: 'अति आवश्यक चेतावनी: देवनार और चेंबूर बेल्ट में भारी धुआं दर्ज किया गया है। गोवंडी और मानखुर्द क्षेत्र के नागरिक खिड़कियां बंद रखें और बाहर जाने से बचें।',
          gu: 'તાત્કાલિક ચેતવણી: દેવનાર અને ચેમ્બુર પટ્ટામાં ભારે ધુમાડો ફેલાયો છે. બાળકો અને વૃદ્ધો ઘરની બહાર ન નીકળે.',
        },
      },
      {
        id: 'receptors',
        title: 'वांद्रे-कुर्ला संकुल (BKC) मेट्रो कॉरिडोर धूळ नियंत्रण',
        severity: 'HIGH',
        texts: {
          mr: 'बीकेसी ट्रान्ઝિટ कॉरिडोर निर्देश: मेट्रो आणि रस्ते बांधकामामुळे PM10 ची पातळी वाढली आहे. बीएमसीने पाण्याचे फवारे मारण्याचे आदेश दिले आहेत. पादचाऱ्यांनी एन95 मास्क वापरावा.',
          en: 'BKC Transit Corridor Particulate Advisory: Fugitive dust resuspension exceeding permissible thresholds near metro construction pits. BMC mobile mist sprinklers deployed. Commuters advised to wear N95 respirators.',
          hi: 'बीकेसी कॉरिडोर निर्देश: मेट्रो निर्माण के चलते PM10 स्तर अत्यधिक। बीएमसी ने वाटर स्प्रिंकलर तैनात किए हैं। यात्री N95 मास्क अवश्य पहनें।',
          gu: 'બીકેસી કોરિડોર નિર્દેશ: મેટ્રો બાંધકામથી ધૂળનું પ્રમાણ વધ્યું છે. મુસાફરો N95 માસ્કનો ઉપયોગ કરે.',
        },
      },
    ],
  },
  punjab: {
    primaryLanguage: 'pa',
    supportedLanguages: ['pa', 'hi', 'en'],
    hotspots: ['Sangrur Agrarian Field Belt', 'Ludhiana GT Road Bypass', 'Civil Hospital Zone', 'Dhandari Kalan'],
    scenarios: [
      {
        id: 'ambient',
        title: 'ਪੰਜਾਬ ਪ੍ਰਦੂਸ਼ਣ ਕੰਟਰੋਲ ਬੋਰਡ ਖੇਤੀਬਾੜੀ ਧੂੰਆਂ ਬੁਲੇਟਿਨ',
        severity: 'SEVERE',
        texts: {
          pa: 'ਪੰਜਾਬ ਪ੍ਰਦੂਸ਼ਣ ਰੋਕਥਾਮ ਬੋਰਡ ਜ਼ਰੂਰੀ ਸੂਚਨਾ: ਏਕਿਊਆਈ 412 (ਗੰਭੀਰ ਪੱਧਰ) ਤੇ ਪਹੁੰਚ ਚੁੱਕਾ ਹੈ। ਝੋਨੇ ਦੀ ਪਰਾਲੀ ਸਾੜਨ ਕਾਰਨ ਸੰਗਰੂਰ ਅਤੇ ਲੁਧਿਆਣਾ ਵਿੱਚ ਜ਼ਹਿਰੀਲਾ ਧੂੰਆਂ ਫੈਲਿਆ ਹੋਇਆ ਹੈ। ਸਾਰੇ ਨਾਗਰਿਕ ਘਰਾਂ ਵਿੱਚ ਰਹਿਣ ਅਤੇ ਬਾਹਰ ਨਾ ਨਿਕਲਣ।',
          hi: 'पंजाब प्रदूषण नियंत्रण बोर्ड बुलेटिन: राज्य का औसत AQI 412 (गंभीर स्तर) दर्ज किया गया है। पराली दहन के धुएं से संगरूर, लुधियाना व पटियाला में धुंध छाई है। वृद्धजन व बच्चे घर से बाहर कतई न निकलें।',
          en: 'Punjab Agrarian Belt Emergency Directive: Regional AQI stands at 412 (Severe category). Intense post-harvest agricultural biomass pyrolysis blanketing Sangrur, Ludhiana, and Patiala rural corridors. Complete outdoor moratorium in place.',
        },
      },
      {
        id: 'incident',
        title: 'ਸੰਗਰੂਰ-ਧੂਰੀ ਖੇਤੀਬਾੜੀ ਖੇਤ ਪਰਾਲੀ ਅੱਗ ਚੇਤਾਵਨੀ',
        severity: 'CRITICAL',
        texts: {
          pa: 'ਸੰਕਟਕਾਲੀਨ ਚੇਤਾਵਨੀ: ਸੰਗਰੂਰ-ਧੂਰੀ ਰੋਡ ਨੇੜੇ ਖੇਤਾਂ ਵਿੱਚ ਪਰਾਲੀ ਸਾੜਨ ਕਾਰਨ ਜੀ.ਟੀ. ਰੋਡ ਤੇ ਵਿਜ਼ੀਬਿਲਟੀ 150 ਮੀਟਰ ਤੋਂ ਘੱਟ ਹੋ ਗਈ ਹੈ। ਗੱਡੀਆਂ ਹੌਲੀ ਚਲਾਓ ਅਤੇ ਖਿੜਕੀਆਂ ਬੰਦ ਰੱਖੋ।',
          en: 'CRITICAL BIOMASS PLUME WARNING: Dense agricultural stubble smoke cluster identified along the Sangrur-Dhuri rural corridor. Highway visibility under 150 meters. Flying enforcement squads dispatched. Motorists exercise extreme caution.',
          hi: 'अति आवश्यक चेतावनी: संगरूर-धूरी मार्ग पर खेतों में पराली जलने से जीटी रोड पर दृश्यता 150 मीटर से कम हो गई है। वाहन धीमी गति से चलाएं और खिड़कियां बंद रखें।',
        },
      },
      {
        id: 'receptors',
        title: 'ਲੁਧਿਆਣਾ ਇੰਡਸਟਰੀਅਲ ਬਾਈਪਾਸ ਤੇ ਸਿਵਲ ਹਸਪਤਾਲ ਸੁਰੱਖਿਆ',
        severity: 'HIGH',
        texts: {
          pa: 'ਲੁਧਿਆਣਾ ਸੰਵੇਦਨਸ਼ੀਲ ਜ਼ੋਨ ਚੇਤਾਵਨੀ: ਸਿਵਲ ਹਸਪਤਾਲ ਅਤੇ ਢੰਡਾਰੀ ਕਲਾਂ ਸਕੂਲਾਂ ਨੇੜੇ PM2.5 ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ। ਮਰੀਜ਼ਾਂ ਅਤੇ ਵਿਦਿਆರ್ಥੀਆਂ ਨੂੰ ਅੰਦਰ ਰਹਿਣ ਦੀ ਹਦਾਇਤ ਕੀਤੀ ਗਈ ਹੈ।',
          en: 'Ludhiana Industrial Bypass Receptor Advisory: Critical PM2.5 concentrations near Dhandari Kalan and Civil Hospital perimeter. Medical air purifiers mandated. Outdoor sports and student assemblies cancelled.',
          hi: 'लुधियाना संवेदनशील क्षेत्र निर्देश: सिविल अस्पताल और ढंडारी कलां के पास PM2.5 स्तर गंभीर। अस्पतालों में एयर प्यूरीफायर अनिवार्य और बाहरी सभाएं रद्द।',
        },
      },
    ],
  },
};

/**
 * Returns dynamic broadcast scenarios matching the city and situation
 */
export function getCityBroadcastData(cityId = 'delhi') {
  const normId = cityId === 'delhi_ncr' ? 'delhi' : cityId;
  return CITY_BROADCAST_CONFIG[normId] || CITY_BROADCAST_CONFIG.delhi;
}
