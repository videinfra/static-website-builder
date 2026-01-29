import runPreprocess  from '../lib/run-preprocess.js';
import { jest } from '@jest/globals';

test('Disabled task doesn\'t run preprocess', () => {
    const preprocessCalled = jest.fn();
    const config = {
        'task': false,
        'preprocess': {
            'task': [
                function () {
                    preprocessCalled();
                }
            ]
        }
    };

    expect(runPreprocess(config).task).toBe(false);
    expect(preprocessCalled).not.toHaveBeenCalled();
});

test('Task without preprocess is the same', () => {
    const configTrue = {'task': {'a': 1}, 'preprocess': {'task': []}};
    expect(runPreprocess(configTrue).task).toEqual({'a': 1});
});

test('Preprocess returning false should result in false config', () => {
    const config = {
        'task': {},
        'preprocess': {
            'task': [
                () => false
            ]
        }
    };

    expect(runPreprocess(config).task).toBe(false);
});

test('Preprocess returning non-object should result in same config config', () => {
    const configTrue = {'task': {'a': 1}, 'preprocess': {'task': [() => true]}};
    expect(runPreprocess(configTrue).task).toEqual({'a': 1});

    const configNumber = {'task': {'a': 1}, 'preprocess': {'task': [() => 1]}};
    expect(runPreprocess(configNumber).task).toEqual({'a': 1});

    const configString = {'task': {'a': 1}, 'preprocess': {'task': [() => 'string']}};
    expect(runPreprocess(configString).task).toEqual({'a': 1});

    // Task config can be an array, this is used for javascripts
    const configArray = {'task': {'a': 1}, 'preprocess': {'task': [() => ['a', 'b']]}};
    expect(runPreprocess(configArray).task).toEqual(['a', 'b']);
});

test('Preprocess returning false shouldn\'t call other preprocesses', () => {
    const preprocessCalled = jest.fn();
    const config = {
        'task': {'a': 1},
        'preprocess': {
            'task': [
                () => false,
                () => preprocessCalled()
            ]
        }
    };

    expect(runPreprocess(config).task).toBe(false);
    expect(preprocessCalled).not.toHaveBeenCalled();
});

test('Preprocess values are passed', () => {
    const config = {
        'task': {
            'value0': 0
        },
        'preprocess': {
            'task': [
                (config) => {
                    config.value1 = config.value0 + 1;
                    return config;
                },
                (config) => {
                    config.value2 = config.value1 + 1;
                    return config;
                }
            ]
        }
    };

    expect(runPreprocess(config).task).toEqual({'value0': 0, 'value1': 1, 'value2': 2});
});
