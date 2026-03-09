import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { isAuthError, isNonClaudeModel } from '../llm-provider.js';

describe('isAuthError', () => {
  it('detects "Not logged in" in error message', () => {
    assert.equal(isAuthError('Error: Not logged in · Please run /login'), true);
  });

  it('detects "Please run /login" in stderr', () => {
    assert.equal(isAuthError('some preamble\nPlease run /login\n'), true);
  });

  it('detects loggedIn: false in JSON output', () => {
    assert.equal(isAuthError('{"loggedIn": false, "user": null}'), true);
  });

  it('detects loggedIn:false without spaces', () => {
    assert.equal(isAuthError('loggedIn:false'), true);
  });

  it('returns false for non-auth errors', () => {
    assert.equal(isAuthError('Claude Code process exited with code 1'), false);
  });

  it('returns false for empty string', () => {
    assert.equal(isAuthError(''), false);
  });

  it('returns false for generic network error', () => {
    assert.equal(isAuthError('ECONNREFUSED 127.0.0.1:443'), false);
  });
});

describe('isNonClaudeModel', () => {
  it('detects gpt- prefixed models', () => {
    assert.equal(isNonClaudeModel('gpt-5-codex'), true);
    assert.equal(isNonClaudeModel('gpt-4o'), true);
  });

  it('detects o1/o3 prefixed models', () => {
    assert.equal(isNonClaudeModel('o1-preview'), true);
    assert.equal(isNonClaudeModel('o3-mini'), true);
  });

  it('detects codex- prefixed models', () => {
    assert.equal(isNonClaudeModel('codex-mini'), true);
  });

  it('returns false for claude models', () => {
    assert.equal(isNonClaudeModel('claude-opus-4-6'), false);
    assert.equal(isNonClaudeModel('claude-sonnet-4-6'), false);
  });

  it('returns false for undefined/empty', () => {
    assert.equal(isNonClaudeModel(undefined), false);
    assert.equal(isNonClaudeModel(''), false);
  });
});
