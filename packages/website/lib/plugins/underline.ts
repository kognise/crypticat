import MarkdownIt from "markdown-it";
import Renderer from "markdown-it/lib/renderer";
import Token from "markdown-it/lib/token";

export default (md: MarkdownIt) => {

  const renderEm = (tokens: Token[], idx: number, opts: MarkdownIt.Options, _: any, slf: Renderer) => {
    var token = tokens[idx];
    if (token.markup === '__') {
      token.tag = 'u';
    }
    return slf.renderToken(tokens, idx, opts);
  }
  md.renderer.rules.strong_open = renderEm;
  md.renderer.rules.strong_close = renderEm;
};