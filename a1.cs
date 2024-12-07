using System;
using System.Collections.Generic;
namespace M1 {
    public class M2 {
        public static void H1(string a) { Console.WriteLine(a); }
    }
    public class ParsedLine {
        public string Label { get; set; }
        public string Inst { get; set; }
        public List<string> Operands { get; set; }
        public ParsedLine() {
            Label = "";
            Inst = "";
            Operands = new List<string>();
        }
    }
    public static class Utility {
        public static bool IsSpace(char ch) { return ch <= ' '; }
    }
    public class Token {
        public int IndexNext { get; set; }
        public string TokenValue { get; set; }
        public Token() {
            IndexNext = 0;
            TokenValue = "";
        }
        public bool GetToken(string input) {
            int n = IndexNext;
            if (n >= input.Length) { return false; }
            char ch = input[n];
            if (ch == ';') { return false; }
            if (ch == ',') {
                TokenValue = ",";
                IndexNext = n + 1;
                return true;
            }
            if (Utility.IsSpace(ch)) {
                n++;
                while (n < input.Length && Utility.IsSpace(input[n])) { n++; }
                TokenValue = " ";
                IndexNext = n;
                return true;
            }
            bool inQuote = false;
            List<char> ar = new List<char>();
            while (n < input.Length) {
                ch = input[n];
                if (inQuote) {
                    if (ch == '\'') { inQuote = false; }
                    ar.Add(ch);
                }
                else {
                    if (ch == '\'') { inQuote = true; }
                    else if (Utility.IsSpace(ch) || ch == ';' || ch == ',') { break; }
                    ar.Add(char.ToUpper(ch));
                }
                n++;
            }
            TokenValue = new string(ar.ToArray());
            IndexNext = n;
            return true;
        }
    }
    public static class LineParser {
        public static ParsedLine ParseLine(string input) {
            ParsedLine parsedLine = new ParsedLine();
            Token token = new Token();
            if (!token.GetToken(input)) { return parsedLine; }
            if (token.TokenValue != " ") {
                parsedLine.Label = token.TokenValue;
                if (!token.GetToken(input)) { return parsedLine; }
            }
            if (!token.GetToken(input)) { return parsedLine; }
            parsedLine.Inst = token.TokenValue;
            if (!token.GetToken(input)) { return parsedLine; }
            if (!token.GetToken(input)) { return parsedLine; }
            parsedLine.Operands.Add(token.TokenValue);
            while (true) {
                if (!token.GetToken(input)) { return parsedLine; }
                if (token.TokenValue == " ") { return parsedLine; }
                token.GetToken(input);
                parsedLine.Operands.Add(token.TokenValue);
            }
        }
    }
}