import toTitleCase from "@gouch/to-title-case";

const setCase = (text = "", caseType = "title") => {
    //Change text to case specified by caseType string
    switch (caseType.toLowerCase()) {
        case "upper":
        case "uppercase":
        case "upper_case":
        case "upper-case":
        case "capitals":
        case "allcaps":
        case "all_caps":
        case "all-caps":
            return text.toUpperCase()
            break
        case "lower":
        case "lowercase":
        case "lower_case":
        case "lower-case":
        case "nocaps":
        case "no_caps":
        case "no-caps":
            return text.toLowerCase();
            break;
        case "proper":
        case "proper_case":
        case "proper-case":
        case "sentence":
        case "sentence_case":
        case "sentence-case":
            return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
            break;
        case "capitalise":
        case "capitalize":
        case "firstletter":
        case "first_letter":
        case "first-letter":
            return text.charAt(0).toUpperCase() + text.slice(1);
            break;
        case "alternating":
        case "alternatingcase":
        case "alternating_case":
        case "alternating-case":
        case "alternatingcaps":
        case "alternating_caps":
        case "alternating-caps":
        case "alternate":
        case "alternate_case":
        case "alternate-case":
        case "sticky":
        case "sticky_case":
        case "sticky-case":
        case "studly":
        case "studly_case":
        case "studly-case":
        case "alternate":
        case "alternate_caps":
        case "alternate-caps":
        case "sticky":
        case "sticky_caps":
        case "sticky-caps":
        case "studly":
        case "studly_caps":
        case "studly-caps":
            //credit - https://codegolf.stackexchange.com/questions/122783/alternate-the-case
            return text.replace(/[a-z]/gi, c => c[`to${(text = !text) ? 'Low' : 'Upp'}erCase`]());
            break;
        case "title":
        case "titlecase":
        case "title_case":
        case "title-case":
        case "totitlecase":
        case "to-title-case":
            return text.toTitleCase();
            break;
        default:
            return text;
    }
};
export default setCase;