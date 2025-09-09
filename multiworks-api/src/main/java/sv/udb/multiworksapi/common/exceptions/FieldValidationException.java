package sv.udb.multiworksapi.common.exceptions;

import lombok.Getter;

@Getter
public class FieldValidationException extends RuntimeException {
    private final String field;

    public FieldValidationException(String field, String message) {
        super(message);
        this.field = field;
    }
}
